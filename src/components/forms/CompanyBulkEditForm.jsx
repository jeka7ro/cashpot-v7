import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CompanyBulkEditForm({ onSubmit, onCancel, selectionCount }) {
  const [formData, setFormData] = useState({
    name: '',
    registration_number: '',
    tax_id: '',
    address: '',
    phone: '',
    email: '',
    contact_person: '',
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
        Completați doar câmpurile pe care doriți să le actualizați pentru cele <strong>{selectionCount}</strong> companii selectate. 
        Câmpurile lăsate goale nu vor fi modificate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Company Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input id="contact_person" name="contact_person" value={formData.contact_person} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="registration_number">Registration Number</Label>
          <Input id="registration_number" name="registration_number" value={formData.registration_number} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax_id">Tax ID</Label>
          <Input id="tax_id" name="tax_id" value={formData.tax_id} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
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
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Selected Companies</Button>
      </div>
    </form>
  );
}