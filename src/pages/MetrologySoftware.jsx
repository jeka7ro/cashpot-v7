import React, { useState, useEffect } from "react";
import { MetrologySoftware, Provider, Cabinet, GameMix } from "@/api/entities";
import { Laptop, Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "../components/common/Modal";
import MetrologySoftwareForm from "../components/forms/MetrologySoftwareForm";

export default function MetrologySoftwarePage() {
  const [software, setSoftware] = useState([]);
  const [providers, setProviders] = useState([]);
  const [cabinets, setCabinets] = useState([]);
  const [gameMixes, setGameMixes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSoftware, setEditingSoftware] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [softwareData, providersData, cabinetsData, gameMixesData] = await Promise.all([
        MetrologySoftware.list(),
        Provider.list(),
        Cabinet.list(),
        GameMix.list()
      ]);
      
      const sortedSoftware = softwareData.sort((a, b) => 
        new Date(b.created_date || 0) - new Date(a.created_date || 0)
      );
      
      setSoftware(sortedSoftware);
      setProviders(providersData);
      setCabinets(cabinetsData);
      setGameMixes(gameMixesData);
    } catch (error) {
      console.error('Error loading software data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to get names by ID
  const getProviderName = (providerId) => {
    if (!providerId) return 'N/A';
    const provider = providers.find(p => p.id === providerId);
    return provider ? provider.name : 'N/A';
  };

  const getCabinetName = (cabinetId) => {
    if (!cabinetId) return 'N/A';
    const cabinet = cabinets.find(c => c.id === cabinetId);
    return cabinet ? cabinet.name : 'N/A';
  };

  const getGameMixName = (gameMixId) => {
    if (!gameMixId) return 'N/A';
    const gameMix = gameMixes.find(gm => gm.id === gameMixId);
    return gameMix ? gameMix.name : 'N/A';
  };

  const getFilteredData = () => {
    let data = software;
    
    if (searchTerm) {
      data = data.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.name?.toLowerCase().includes(searchLower) ||
          getProviderName(item.provider_id).toLowerCase().includes(searchLower) ||
          getCabinetName(item.cabinet_id).toLowerCase().includes(searchLower) ||
          getGameMixName(item.game_mix_id).toLowerCase().includes(searchLower) ||
          item.serial_numbers?.some(sn => sn.toLowerCase().includes(searchLower))
        );
      });
    }
    
    return data;
  };

  const handleAdd = () => {
    setEditingSoftware(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingSoftware(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this software?')) {
      try {
        const result = await MetrologySoftware.delete(item.id);
        if (result.success) {
          await loadData();
        } else {
          alert('Failed to delete software.');
        }
      } catch (error) {
        console.error('Error deleting software:', error);
        alert('Error deleting software.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let result;
      if (editingSoftware) {
        result = await MetrologySoftware.update(editingSoftware.id, formData);
      } else {
        result = await MetrologySoftware.create(formData);
      }
      
      if (result.success) {
        await loadData();
        setIsModalOpen(false);
        setEditingSoftware(null);
      } else {
        alert('Failed to save software.');
      }
    } catch (error) {
      console.error('Error saving software:', error);
      alert('Error saving software.');
    }
  };

  const filteredData = getFilteredData();

  if (isLoading) {
    return (
      <div className="p-6 bg-background min-h-screen text-foreground">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading software...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Metrology Software</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search software..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card border-border w-64"
          />
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Software
          </Button>
        </div>
      </header>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Cabinet</TableHead>
              <TableHead>Game Mix</TableHead>
              <TableHead>Serial Numbers</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="border-border">
                <TableCell>
                  <div className="font-medium text-foreground">
                    {item.name || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-foreground">
                    {getProviderName(item.provider_id)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-foreground">
                    {getCabinetName(item.cabinet_id)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-foreground">
                    {getGameMixName(item.game_mix_id)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-foreground">
                    {Array.isArray(item.serial_numbers) 
                      ? item.serial_numbers.join(', ') 
                      : item.serial_numbers || 'N/A'
                    }
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {item.created_date ? format(new Date(item.created_date), 'MMM d, yyyy') : 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'No software found matching your search.' : 'No software found. Add some software to get started.'}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSoftware(null);
        }}
        title={editingSoftware ? 'Edit Software' : 'Add New Software'}
      >
        <MetrologySoftwareForm
          software={editingSoftware}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingSoftware(null);
          }}
        />
      </Modal>
    </div>
  );
}
