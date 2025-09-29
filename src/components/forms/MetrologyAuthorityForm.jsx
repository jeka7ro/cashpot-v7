import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MetrologyAuthorityForm({ authority, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    status: 'active'
  });

  useEffect(() => {
    if (authority) {
      setFormData({
        ...authority
      });
    } else {
      setFormData({
        name: '',
        address: '',
        status: 'active'
      });
    }
  }, [authority]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
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
      <div className="space-y-2">
        <Label htmlFor="name">Nume</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          className="bg-input border-border" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresă</Label>
        <Textarea 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          required 
          className="bg-input border-border" 
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
          <SelectTrigger id="status" className="bg-input border-border">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {authority ? 'Update' : 'Create'} Authority
        </Button>
      </div>
    </form>
  );
}
