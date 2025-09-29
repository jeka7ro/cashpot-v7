import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MetrologyApprovalForm({ approval, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    denumire: '',
    data_emitere: '',
    data_expirare: '',
    status: 'active'
  });

  useEffect(() => {
    if (approval) {
      setFormData({
        ...approval,
        data_emitere: approval.data_emitere ? approval.data_emitere.split('T')[0] : '',
        data_expirare: approval.data_expirare ? approval.data_expirare.split('T')[0] : '',
      });
    } else {
      setFormData({
        denumire: '',
        data_emitere: '',
        data_expirare: '',
        status: 'active'
      });
    }
  }, [approval]);

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
        <Label htmlFor="denumire">Denumire</Label>
        <Input 
          id="denumire" 
          name="denumire" 
          value={formData.denumire} 
          onChange={handleChange} 
          required 
          className="bg-input border-border" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="data_emitere">Data emitere</Label>
          <Input 
            id="data_emitere" 
            name="data_emitere" 
            type="date" 
            value={formData.data_emitere} 
            onChange={handleChange} 
            className="bg-input border-border" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="data_expirare">Data expirare</Label>
          <Input 
            id="data_expirare" 
            name="data_expirare" 
            type="date" 
            value={formData.data_expirare} 
            onChange={handleChange} 
            className="bg-input border-border" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
          <SelectTrigger id="status" className="bg-input border-border">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {approval ? 'Update' : 'Create'} Approval
        </Button>
      </div>
    </form>
  );
}
