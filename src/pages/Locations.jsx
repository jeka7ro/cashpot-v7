import React, { useState, useEffect } from "react";
import { Location, Company } from "@/api/entities";
import { MapPin, Building2, Globe, Plus, Edit, Trash2 } from "lucide-react";
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
import LocationForm from "../components/forms/LocationForm";
import LocationBulkEditForm from "../components/forms/LocationBulkEditForm";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Locations.loadData called');
      setIsLoading(true);
      const [locationsData, companiesData] = await Promise.all([
        Location.list('-created_date'),
        Company.list()
      ]);
      console.log('Loaded locations data:', locationsData);
      console.log('Loaded companies data:', companiesData);
      setLocations(locationsData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAdd = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleDelete = async (locationId) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await Location.delete(locationId);
        await loadData();
      } catch (error) {
        console.error('Error deleting location:', error);
        alert('Failed to delete location.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      console.log('Locations.handleFormSubmit called with:', formData);
      console.log('Editing location:', editingLocation);
      
      if (editingLocation) {
        console.log('Updating location with ID:', editingLocation.id);
        const result = await Location.update(editingLocation.id, formData);
        console.log('Location update result:', result);
      } else {
        console.log('Creating new location');
        const result = await Location.create(formData);
        console.log('Location create result:', result);
      }
      
      console.log('Reloading data...');
      await loadData();
      console.log('Data reloaded, closing modal');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Failed to save location: ' + error.message);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allLocationIds = filteredLocations.map(l => l.id);
      setSelectedLocations(allLocationIds);
    } else {
      setSelectedLocations([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedLocations.includes(id)) {
      setSelectedLocations(selectedLocations.filter(locId => locId !== id));
    } else {
      setSelectedLocations([...selectedLocations, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLocations.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedLocations.length} locations?`)) {
      try {
        setIsLoading(true);
        await Promise.all(selectedLocations.map(id => Location.delete(id)));
        await loadData();
        setSelectedLocations([]);
      } catch (error) {
        console.error('Error deleting locations:', error);
        alert('Failed to delete locations.');
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
      await Promise.all(selectedLocations.map(id => Location.update(id, updates)));
      await loadData();
      setIsBulkEditModalOpen(false);
      setSelectedLocations([]);
    } catch (error) {
      console.error('Error bulk editing locations:', error);
      alert('Failed to bulk edit locations.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'inactive': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'maintenance': return 'bg-red-900/30 text-red-300 border-red-700';
      default: return 'bg-background/30 text-muted-foreground border-border';
    }
  };

  const filteredLocations = locations.filter(location =>
    (location.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (location.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCompanyName(location.company_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
       <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Locations</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card border-border w-64"
          />
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
          <Button 
            onClick={() => setIsBulkEditModalOpen(true)}
            disabled={selectedLocations.length === 0}
            variant="outline"
            className="border-border bg-card hover:bg-muted"
          >
            <Edit className="w-4 h-4 mr-2" />
            Bulk Edit ({selectedLocations.length})
          </Button>
          <Button 
            onClick={handleBulkDelete}
            disabled={selectedLocations.length === 0}
            variant="destructive"
            className="bg-red-800/80 hover:bg-red-800"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Bulk Delete ({selectedLocations.length})
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
                  checked={filteredLocations.length > 0 && selectedLocations.length === filteredLocations.length}
                  ref={input => {
                    if (input) {
                      input.indeterminate = selectedLocations.length > 0 && selectedLocations.length < filteredLocations.length;
                    }
                  }}
                />
              </TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Company</TableHead>
              <TableHead className="text-muted-foreground">Address</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
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
                  <TableCell><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-16"></div></TableCell>
                  <TableCell><div className="h-8 bg-muted rounded w-20 ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : (
              filteredLocations.map(location => (
                <TableRow key={location.id} className="border-border">
                  <TableCell className="text-center">
                    <input 
                      type="checkbox" 
                      className="bg-muted border-border rounded"
                      checked={selectedLocations.includes(location.id)}
                      onChange={() => handleSelectOne(location.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{location.name}</div>
                        <div className="text-sm text-muted-foreground">{location.city}, {location.county}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{getCompanyName(location.company_id)}</span>
                    </div>
                  </TableCell>
                   <TableCell>
                    <div className="text-sm text-muted-foreground">{location.address}</div>
                    <div className="text-sm text-muted-foreground">{location.postal_code} {location.country}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(location.status)}>{location.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(location)} className="hover:bg-muted">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(location.id)} className="hover:bg-muted text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {filteredLocations.length === 0 && !isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            No locations found.
          </div>
        )}
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLocation ? "Edit Location" : "Add New Location"}
      >
        <LocationForm
          location={editingLocation}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        title={`Bulk Edit ${selectedLocations.length} Locations`}
      >
        <LocationBulkEditForm
          onSubmit={handleBulkEditSubmit}
          onCancel={() => setIsBulkEditModalOpen(false)}
          selectionCount={selectedLocations.length}
        />
      </Modal>

    </div>
  );
}