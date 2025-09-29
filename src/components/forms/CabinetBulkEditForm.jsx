import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Provider } from '@/api/entities';

export default function CabinetBulkEditForm({ onSubmit, onCancel, selectionCount }) {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    provider_id: '',
    status: '',
  });
  
  const [providers, setProviders] = useState([]);
  useEffect(() => {
    Provider.list().then(setProviders);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      <p className="text-muted-foreground text-sm">
        Completați doar câmpurile pe care doriți să le actualizați pentru cele <strong>{selectionCount}</strong> cabinete selectate. 
        Câmpurile lăsate goale nu vor fi modificate.
      </p>
      
      <div className="space-y-2">
        <Label htmlFor="name">Cabinet Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input id="model" name="model" value={formData.model} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="provider_id">Provider</Label>
        <Select value={formData.provider_id} onValueChange={(value) => handleSelectChange('provider_id', value)}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue placeholder="Păstrează valoarea originală" />
          </SelectTrigger>
          <SelectContent>
            {providers.map(provider => <SelectItem key={provider.id} value={provider.id}>{provider.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue placeholder="Păstrează valoarea originală" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Selected Cabinets</Button>
      </div>
    </form>
  );
}