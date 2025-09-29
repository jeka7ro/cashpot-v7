import React, { useState, useEffect } from "react";
import { Provider } from "@/api/entities";
import { Search, Plus, Edit, Trash2, Eye, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "../components/common/Modal";
import ProviderForm from "../components/forms/ProviderForm";
import ProviderBulkEditForm from "../components/forms/ProviderBulkEditForm";

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setIsLoading(true);
      const data = await Provider.list('-created_date');
      setProviders(data);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProvider(null);
    setIsModalOpen(true);
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setIsModalOpen(true);
  };

  const handleDelete = async (providerId) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      try {
        await Provider.delete(providerId);
        await loadProviders();
      } catch (error) {
        console.error('Error deleting provider:', error);
        alert('Failed to delete provider.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      console.log('Saving provider:', formData);
      let result;
      if (editingProvider) {
        console.log('Updating provider:', editingProvider.id);
        result = await Provider.update(editingProvider.id, formData);
      } else {
        console.log('Creating new provider');
        result = await Provider.create(formData);
      }
      console.log('Provider saved successfully:', result);
      await loadProviders();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving provider:', error);
      alert('Failed to save provider: ' + error.message);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allProviderIds = filteredProviders.map(p => p.id);
      setSelectedProviders(allProviderIds);
    } else {
      setSelectedProviders([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedProviders.includes(id)) {
      setSelectedProviders(selectedProviders.filter(providerId => providerId !== id));
    } else {
      setSelectedProviders([...selectedProviders, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProviders.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedProviders.length} providers?`)) {
      try {
        setIsLoading(true);
        await Promise.all(selectedProviders.map(id => Provider.delete(id)));
        await loadProviders();
        setSelectedProviders([]);
      } catch (error) {
        console.error('Error deleting providers:', error);
        alert('Failed to delete providers.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBulkEditSubmit = async (formData) => {
    const updates = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (Object.keys(updates).length === 0) {
      setIsBulkEditModalOpen(false);
      return;
    }

    try {
      setIsLoading(true);
      await Promise.all(selectedProviders.map(id => Provider.update(id, updates)));
      await loadProviders();
      setIsBulkEditModalOpen(false);
      setSelectedProviders([]);
    } catch (error) {
      console.error('Error bulk editing providers:', error);
      alert('Failed to bulk edit providers.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider => 
    (provider.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (provider.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (provider.contact_person || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Providers</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border-border pl-9"
            />
          </div>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </Button>
          <Button 
            onClick={() => setIsBulkEditModalOpen(true)}
            disabled={selectedProviders.length === 0}
            variant="outline"
            className="border-border bg-card hover:bg-muted"
          >
            <Edit className="w-4 h-4 mr-2" />
            Bulk Edit ({selectedProviders.length})
          </Button>
          <Button 
            onClick={handleBulkDelete}
            disabled={selectedProviders.length === 0}
            variant="destructive"
            className="bg-red-800/80 hover:bg-red-800"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Bulk Delete ({selectedProviders.length})
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
                  checked={filteredProviders.length > 0 && selectedProviders.length === filteredProviders.length}
                  ref={input => {
                    if (input) {
                      input.indeterminate = selectedProviders.length > 0 && selectedProviders.length < filteredProviders.length;
                    }
                  }}
                />
              </TableHead>
              <TableHead className="text-muted-foreground">Provider</TableHead>
              <TableHead className="text-muted-foreground">Company</TableHead>
              <TableHead className="text-muted-foreground">Contact</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell><div className="h-4 bg-muted rounded w-4 mx-auto"></div></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-24"></div>
                        <div className="h-3 bg-muted rounded w-32"></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-1/2"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                  <TableCell><div className="h-8 bg-muted rounded w-20 ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : (
              filteredProviders.map(provider => (
                <TableRow key={provider.id} className="border-border">
                  <TableCell className="text-center">
                    <input 
                      type="checkbox" 
                      className="bg-muted border-border rounded"
                      checked={selectedProviders.includes(provider.id)}
                      onChange={() => handleSelectOne(provider.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={provider.avatar} alt={provider.name} />
                        <AvatarFallback className="bg-purple-900/50 text-purple-400">
                          <Factory className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{provider.name}</div>
                        <div className="text-sm text-muted-foreground">{provider.company_name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{provider.company_name}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">{provider.contact_person}</div>
                    <div className="text-sm text-muted-foreground">{provider.email}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-muted">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(provider)} className="hover:bg-muted">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(provider.id)} className="hover:bg-muted text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {filteredProviders.length === 0 && !isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            No providers found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProvider ? "Edit Provider" : "Add New Provider"}
      >
        <ProviderForm
          provider={editingProvider}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        title={`Bulk Edit ${selectedProviders.length} Providers`}
      >
        <ProviderBulkEditForm
          onSubmit={handleBulkEditSubmit}
          onCancel={() => setIsBulkEditModalOpen(false)}
          selectionCount={selectedProviders.length}
        />
      </Modal>
    </div>
  );
}