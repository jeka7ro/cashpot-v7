import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProviderBulkEditForm({ onSubmit, onCancel, selectionCount }) {
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    status: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      <p className="text-muted-foreground text-sm">
        Completați doar câmpurile pe care doriți să le actualizați pentru cei <strong>{selectionCount}</strong> furnizori selectați. 
        Câmpurile lăsate goale nu vor fi modificate.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Provider Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_name">Legal Company Name</Label>
          <Input id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
      </div>
      
       <div className="space-y-2">
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input id="contact_person" name="contact_person" value={formData.contact_person} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={handleStatusChange}>
          <SelectTrigger id="status" className="bg-input border-border">
            <SelectValue placeholder="Păstrează valoarea originală" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Update Selected Providers
        </Button>
      </div>
    </form>
  );
}