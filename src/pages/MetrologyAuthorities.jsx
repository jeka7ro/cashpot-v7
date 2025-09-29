import React, { useState, useEffect } from "react";
import { MetrologyAuthority } from "@/api/entities";
import { Building, Plus, Edit, Trash2 } from "lucide-react";
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
import MetrologyAuthorityForm from "../components/forms/MetrologyAuthorityForm";

export default function MetrologyAuthoritiesPage() {
  const [authorities, setAuthorities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthority, setEditingAuthority] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('MetrologyAuthorities.loadData called');
      setIsLoading(true);
      const authoritiesData = await MetrologyAuthority.list();
      console.log('Loaded authorities data:', authoritiesData);
      
      // Sort by created_date descending
      const sortedAuthorities = authoritiesData.sort((a, b) => 
        new Date(b.created_date || 0) - new Date(a.created_date || 0)
      );
      setAuthorities(sortedAuthorities);
    } catch (error) {
      console.error('Error loading authorities data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAuthority(null);
    setIsModalOpen(true);
  };

  const handleEdit = (authority) => {
    setEditingAuthority(authority);
    setIsModalOpen(true);
  };

  const handleDelete = async (authority) => {
    if (window.confirm('Are you sure you want to delete this authority?')) {
      try {
        const result = await MetrologyAuthority.delete(authority.id);
        if (result.success) {
          await loadData();
        } else {
          alert('Failed to delete authority.');
        }
      } catch (error) {
        console.error('Error deleting authority:', error);
        alert('Failed to delete authority: ' + error.message);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      console.log('MetrologyAuthorities.handleFormSubmit called with:', formData);
      console.log('Editing authority:', editingAuthority);
      
      if (editingAuthority) {
        console.log('Updating authority with ID:', editingAuthority.id);
        const result = await MetrologyAuthority.update(editingAuthority.id, formData);
        console.log('Authority update result:', result);
      } else {
        console.log('Creating new authority');
        const result = await MetrologyAuthority.create(formData);
        console.log('Authority create result:', result);
      }
      
      console.log('Reloading data...');
      await loadData();
      console.log('Data reloaded, closing modal');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving authority:', error);
      alert('Failed to save authority: ' + error.message);
    }
  };

  const filteredAuthorities = authorities.filter(authority =>
    authority.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    authority.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Autorități Metrologice</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card border-border w-64"
          />
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Authority
          </Button>
        </div>
      </header>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-row">
              <TableHead className="text-muted-foreground">Nume</TableHead>
              <TableHead className="text-muted-foreground">Adresă</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-full"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-20"></div></TableCell>
                  <TableCell><div className="h-8 bg-muted rounded w-20 ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : (
              filteredAuthorities.map(authority => {
                return (
                  <TableRow key={authority.id} className="border-border">
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {authority.name || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground max-w-md">
                        {authority.address || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {authority.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(authority)} className="hover:bg-muted">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(authority)} className="hover:bg-muted text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {filteredAuthorities.length === 0 && !isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            No authorities found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAuthority ? "Edit Authority" : "Add New Authority"}
      >
        <MetrologyAuthorityForm
          authority={editingAuthority}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
