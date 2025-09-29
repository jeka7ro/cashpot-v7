import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Company } from '@/api/entities';

export default function LocationBulkEditForm({ onSubmit, onCancel, selectionCount }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    county: '',
    country: '',
    postal_code: '',
    latitude: '',
    longitude: '',
    company_id: '',
    manager_id: '',
    status: '',
  });

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    Company.list().then(setCompanies);
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || '' : value 
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      <p className="text-muted-foreground text-sm">
        Completați doar câmpurile pe care doriți să le actualizați pentru cele <strong>{selectionCount}</strong> locații selectate. 
        Câmpurile lăsate goale nu vor fi modificate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Location Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_id">Company</Label>
          <Select value={formData.company_id} onValueChange={(value) => handleSelectChange('company_id', value)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Păstrează valoarea originală" />
            </SelectTrigger>
            <SelectContent>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="county">County</Label>
          <Input id="county" name="county" value={formData.county} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" value={formData.country} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input id="latitude" name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input id="longitude" name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
          <SelectTrigger id="status" className="bg-input border-border">
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Update Selected Locations
        </Button>
      </div>
    </form>
  );
}