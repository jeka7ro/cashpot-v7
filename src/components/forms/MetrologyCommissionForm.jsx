import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MetrologyCommissionForm({ commission, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    data_emitere: '',
    data_expirare: '',
    serial_numbers: '',
    serial_count: 0,
    status: 'active'
  });

  useEffect(() => {
    if (commission) {
      // Handle both array and string formats for serial_numbers
      let serialNumbersString = '';
      if (Array.isArray(commission.serial_numbers)) {
        serialNumbersString = commission.serial_numbers.join('\n');
      } else if (typeof commission.serial_numbers === 'string') {
        serialNumbersString = commission.serial_numbers;
      }
      
      // Count by lines (rows), not by array length
      const serialCount = serialNumbersString ? serialNumbersString.split('\n').filter(sn => sn.trim() !== '').length : 0;
      
      setFormData({
        ...commission,
        data_emitere: commission.data_emitere ? commission.data_emitere.split('T')[0] : '',
        data_expirare: commission.data_expirare ? commission.data_expirare.split('T')[0] : '',
        serial_numbers: serialNumbersString,
        serial_count: serialCount
      });
    } else {
      setFormData({
        name: '',
        data_emitere: '',
        data_expirare: '',
        serial_numbers: '',
        serial_count: 0,
        status: 'active'
      });
    }
  }, [commission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-calculate serial count when serial_numbers field changes
    if (name === 'serial_numbers') {
      // Count by lines (rows), not by commas
      const serialCount = value ? value.split('\n').filter(sn => sn.trim() !== '').length : 0;
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        serial_count: serialCount
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      serial_numbers: formData.serial_numbers.split('\n').map(sn => sn.trim()).filter(sn => sn.length > 0)
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      <div className="space-y-2">
        <Label htmlFor="name">Denumire</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
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
        <div className="flex items-center justify-between">
          <Label htmlFor="serial_numbers">Serial Numbers (one per line)</Label>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {formData.serial_count} serii
          </Badge>
        </div>
        <Textarea 
          id="serial_numbers" 
          name="serial_numbers" 
          value={formData.serial_numbers} 
          onChange={handleChange} 
          className="bg-input border-border" 
          placeholder="134862&#10;134863&#10;134864&#10;134865..." 
          rows={4} 
        />
        <p className="text-xs text-muted-foreground">
          Enter one serial number per line. Count will be calculated automatically.
        </p>
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
          {commission ? 'Update' : 'Create'} Commission
        </Button>
      </div>
    </form>
  );
}
