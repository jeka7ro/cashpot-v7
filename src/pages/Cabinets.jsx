import React, { useState, useEffect } from "react";
import { Cabinet, Provider } from "@/api/entities";
import { Monitor, Factory, Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "../components/common/Modal";
import CabinetForm from "../components/forms/CabinetForm";
import CabinetBulkEditForm from "../components/forms/CabinetBulkEditForm";

export default function Cabinets() {
  const [cabinets, setCabinets] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCabinet, setEditingCabinet] = useState(null);
  const [selectedCabinets, setSelectedCabinets] = useState([]);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [cabinetsData, providersData] = await Promise.all([
        Cabinet.list('-created_date'),
        Provider.list()
      ]);
      setCabinets(cabinetsData);
      setProviders(providersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCabinet(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cabinet) => {
    setEditingCabinet(cabinet);
    setIsModalOpen(true);
  };

  const handleDelete = async (cabinetId) => {
    if (window.confirm('Are you sure you want to delete this cabinet?')) {
      try {
        await Cabinet.delete(cabinetId);
        await loadData();
        setSelectedCabinets(prev => prev.filter(id => id !== cabinetId));
      } catch (error) {
        console.error('Error deleting cabinet:', error);
        alert('Failed to delete cabinet.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCabinet) {
        await Cabinet.update(editingCabinet.id, formData);
      } else {
        await Cabinet.create(formData);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving cabinet:', error);
      alert('Failed to save cabinet.');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCabinets(filteredCabinets.map(c => c.id));
    } else {
      setSelectedCabinets([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedCabinets(prev => 
      prev.includes(id) ? prev.filter(cabId => cabId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedCabinets.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedCabinets.length} cabinets?`)) {
      try {
        setIsLoading(true);
        await Promise.all(selectedCabinets.map(id => Cabinet.delete(id)));
        await loadData();
        setSelectedCabinets([]);
      } catch (error) {
        console.error('Error bulk deleting cabinets:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBulkEditSubmit = async (formData) => {
    const updates = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null) acc[key] = value;
      return acc;
    }, {});

    if (Object.keys(updates).length === 0) {
      setIsBulkEditModalOpen(false);
      return;
    }

    try {
      setIsLoading(true);
      await Promise.all(selectedCabinets.map(id => Cabinet.update(id, updates)));
      await loadData();
      setIsBulkEditModalOpen(false);
      setSelectedCabinets([]);
    } catch (error) {
      console.error('Error bulk editing cabinets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderName = (providerId) => {
    const provider = providers.find(p => p.id === providerId);
    if (provider) return provider.name;
    
    // Fallback: try to find by name if ID doesn't match
    const cabinet = cabinets.find(c => c.provider_id === providerId);
    if (cabinet?.provider_name) {
      return cabinet.provider_name;
    }
    
    return 'Unknown Provider';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'inactive': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'maintenance': return 'bg-red-900/30 text-red-300 border-red-700';
      default: return 'bg-background/30 text-muted-foreground border-border';
    }
  };

  const filteredCabinets = cabinets.filter(cabinet =>
    (cabinet.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cabinet.model || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Cabinets</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search cabinets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card border-border w-64"
          />
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Cabinet
          </Button>
          <Button 
            onClick={() => setIsBulkEditModalOpen(true)}
            disabled={selectedCabinets.length === 0}
            variant="outline"
            className="border-border bg-card hover:bg-muted"
          >
            <Edit className="w-4 h-4 mr-2" />
            Bulk Edit ({selectedCabinets.length})
          </Button>
          <Button 
            onClick={handleBulkDelete}
            disabled={selectedCabinets.length === 0}
            variant="destructive"
            className="bg-red-800/80 hover:bg-red-800"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Bulk Delete ({selectedCabinets.length})
          </Button>
        </div>
      </header>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-row">
              <TableHead className="w-12 text-center">
                <input 
                  type="checkbox" 
                  className="bg-muted border-border rounded"
                  onChange={handleSelectAll}
                  checked={filteredCabinets.length > 0 && selectedCabinets.length === filteredCabinets.length}
                  ref={input => {
                    if (input) input.indeterminate = selectedCabinets.length > 0 && selectedCabinets.length < filteredCabinets.length;
                  }}
                />
              </TableHead>
              <TableHead className="text-muted-foreground">Cabinet</TableHead>
              <TableHead className="text-muted-foreground">Provider</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Created</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell><div className="h-4 bg-muted rounded w-4 mx-auto"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-1/2"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-16"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-24"></div></TableCell>
                  <TableCell><div className="h-8 bg-muted rounded w-20 ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : (
              filteredCabinets.map(cabinet => (
                <TableRow key={cabinet.id} className="border-border">
                  <TableCell className="text-center">
                    <input 
                      type="checkbox" 
                      className="bg-muted border-border rounded"
                      checked={selectedCabinets.includes(cabinet.id)}
                      onChange={() => handleSelectOne(cabinet.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-900/50 rounded-lg flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{cabinet.name}</div>
                        <div className="text-sm text-muted-foreground">{cabinet.model || 'N/A'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Factory className="w-4 h-4 text-muted-foreground" />
                      <span>{getProviderName(cabinet.provider_id)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(cabinet.status)}>{cabinet.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(cabinet.created_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cabinet)} className="hover:bg-muted">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cabinet.id)} className="hover:bg-muted text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {filteredCabinets.length === 0 && !isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            No cabinets found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCabinet ? "Edit Cabinet" : "Add New Cabinet"}
      >
        <CabinetForm
          cabinet={editingCabinet}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        title={`Bulk Edit ${selectedCabinets.length} Cabinets`}
      >
        <CabinetBulkEditForm
          onSubmit={handleBulkEditSubmit}
          onCancel={() => setIsBulkEditModalOpen(false)}
          selectionCount={selectedCabinets.length}
        />
      </Modal>
    </div>
  );
}