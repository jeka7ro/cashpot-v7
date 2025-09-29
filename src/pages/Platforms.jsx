import React, { useState, useEffect } from "react";
import { Platform, Provider } from "@/api/entities";
import { Monitor, Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "../components/common/Modal";
import PlatformForm from "../components/forms/PlatformForm";
import { format } from "date-fns";

export default function Platforms() {
  const [platforms, setPlatforms] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    provider: 'all'
  });

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      console.log('Loading platforms data...');
      const [platformsData, providersData] = await Promise.all([
        Platform.list(),
        Provider.list()
      ]);
      console.log('Platforms data loaded:', platformsData);
      console.log('Providers data loaded:', providersData);
      setPlatforms(platformsData);
      setProviders(providersData);
    } catch (error) {
      console.error('Error loading platforms data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'inactive': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'deprecated': return 'bg-red-900/30 text-red-300 border-red-700';
      default: return 'bg-background/30 text-muted-foreground border-border';
    }
  };

  // Handler functions
  const handleAddPlatform = () => {
    setEditingPlatform(null);
    setIsModalOpen(true);
  };

  const handleEditPlatform = (platform) => {
    setEditingPlatform(platform);
    setIsModalOpen(true);
  };

  const handleDeletePlatform = async (platformId) => {
    if (window.confirm('Are you sure you want to delete this platform?')) {
      try {
        await Platform.delete(platformId);
        await loadData();
      } catch (error) {
        console.error('Error deleting platform:', error);
        alert('Failed to delete platform.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPlatform) {
        await Platform.update(editingPlatform.id, formData);
      } else {
        await Platform.create(formData);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving platform:', error);
      alert('Failed to save platform.');
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredPlatforms = platforms.filter(platform => {
    const matchesSearch = searchTerm === '' || 
                         platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         platform.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === '' || filters.status === 'all' || platform.status === filters.status;
    const matchesProvider = filters.provider === '' || filters.provider === 'all' || platform.provider_id === filters.provider;
    return matchesSearch && matchesStatus && matchesProvider;
  });

  console.log('Platforms render - isLoading:', isLoading, 'platforms:', platforms);

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading platforms...
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Platforms</h1>
        <Button onClick={handleAddPlatform} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Platform
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search platforms..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 bg-input border-border"
          />
        </div>

        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger className="w-[180px] bg-input border-border">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="deprecated">Deprecated</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.provider} onValueChange={(value) => handleFilterChange('provider', value)}>
          <SelectTrigger className="w-[180px] bg-input border-border">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter by Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            {providers.map(provider => (
              <SelectItem key={provider.id} value={provider.id}>{provider.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Platforms Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {filteredPlatforms.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No platforms found.</div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlatforms.map((platform) => {
                const provider = providers.find(p => p.id === platform.provider_id);
                return (
                  <TableRow key={platform.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium">{platform.id}</TableCell>
                    <TableCell>{platform.name}</TableCell>
                    <TableCell>{platform.description}</TableCell>
                    <TableCell>{provider ? provider.name : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(platform.status)}`}>
                        {platform.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {platform.created_date ? 
                        format(new Date(platform.created_date), 'PPP') : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditPlatform(platform)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePlatform(platform.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add/Edit Platform Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlatform ? "Edit Platform" : "Add New Platform"}
      >
        <PlatformForm 
          platform={editingPlatform} 
          onSubmit={handleFormSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}