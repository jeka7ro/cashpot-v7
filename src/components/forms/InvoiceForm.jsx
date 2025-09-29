import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import AttachmentUpload from './AttachmentUpload';

export default function InvoiceForm({ invoice, companies, locations, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    invoice_number: '',
    serial_number: '',
    company_id: '',
    location_ids: [],
    amount: '',
    currency: 'EUR',
    issue_date: '',
    due_date: '',
    status: 'pending',
    description: '',
    attachments: []
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoice_number: invoice.invoice_number || '',
        serial_number: invoice.serial_number || '',
        company_id: invoice.company_id || '',
        location_ids: invoice.location_ids || [],
        amount: invoice.amount ? invoice.amount.toLocaleString() : '',
        currency: invoice.currency || 'EUR',
        issue_date: invoice.issue_date ? new Date(invoice.issue_date).toISOString().split('T')[0] : '',
        due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
        status: invoice.status || 'pending',
        description: invoice.description || '',
        attachments: invoice.attachments || []
      });
    } else {
      setFormData({
        invoice_number: '',
        serial_number: '',
        company_id: '',
        location_ids: [],
        amount: '',
        currency: 'EUR',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: '',
        status: 'pending',
        description: '',
        attachments: []
      });
    }
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format amount with thousands separator
    if (name === 'amount') {
      // Remove all non-numeric characters except decimal point
      const numericValue = value.replace(/[^\d.]/g, '');
      // Format with thousands separator
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (locationId, checked) => {
    setFormData(prev => {
      if (locationId === 'all') {
        // Toggle all locations
        const allLocationIds = locations.map(loc => loc.id);
        return {
          ...prev,
          location_ids: checked ? allLocationIds : []
        };
      } else {
        // Toggle specific location
        const newLocationIds = checked
          ? [...prev.location_ids, locationId]
          : prev.location_ids.filter(id => id !== locationId);
        return {
          ...prev,
          location_ids: newLocationIds
        };
      }
    });
  };


  const handleAddAttachments = (newAttachments) => {
    // Convert data to url for consistency with existing system
    const convertedAttachments = newAttachments.map(att => ({
      ...att,
      url: att.data, // Use data as url for base64 PDFs
      data: undefined // Remove data field
    }));
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...convertedAttachments]
    }));
  };

  const handleRemoveAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  const handleDownloadAttachment = (attachment) => {
    // Create download link from base64 data or url
    const link = document.createElement('a');
    link.href = attachment.url || attachment.data;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert formatted amount back to number for submission
    const submitData = {
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount.replace(/,/g, '')) : 0
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="invoice_number">Invoice Number</Label>
          <Input 
            id="invoice_number" 
            name="invoice_number" 
            value={formData.invoice_number} 
            onChange={handleChange} 
            required 
            className="bg-input border-border" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serial_number">Serial Number</Label>
          <Input 
            id="serial_number" 
            name="serial_number" 
            value={formData.serial_number} 
            onChange={handleChange} 
            className="bg-input border-border" 
            placeholder="Connected to slot machine"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input 
            id="amount" 
            name="amount" 
            type="text"
            value={formData.amount} 
            onChange={handleChange} 
            required 
            className="bg-input border-border" 
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger id="status" className="bg-input border-border">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company_id">Company</Label>
          <Select value={formData.company_id} onValueChange={(value) => handleSelectChange('company_id', value)} required>
            <SelectTrigger id="company_id" className="bg-input border-border">
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Locations</Label>
          <Select>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select locations" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <div className="p-2">
                <div className="flex items-center space-x-2 p-2 hover:bg-accent rounded">
                  <Checkbox
                    id="all-locations"
                    checked={formData.location_ids.length === locations.length && locations.length > 0}
                    onCheckedChange={(checked) => handleLocationChange('all', checked)}
                  />
                  <Label htmlFor="all-locations" className="font-medium">All Locations</Label>
                </div>
                {locations.map(location => (
                  <div key={location.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded">
                    <Checkbox
                      id={`location-${location.id}`}
                      checked={formData.location_ids.includes(location.id)}
                      onCheckedChange={(checked) => handleLocationChange(location.id, checked)}
                    />
                    <Label htmlFor={`location-${location.id}`}>{location.name}</Label>
                  </div>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
            <SelectTrigger id="currency" className="bg-input border-border">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="RON">RON</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="issue_date">Issue Date</Label>
          <Input 
            id="issue_date" 
            name="issue_date" 
            type="date"
            value={formData.issue_date} 
            onChange={handleChange} 
            required 
            className="bg-input border-border" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input 
            id="due_date" 
            name="due_date" 
            type="date"
            value={formData.due_date} 
            onChange={handleChange} 
            className="bg-input border-border" 
          />
        </div>
      </div>


      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          className="bg-input border-border" 
          rows={3}
        />
      </div>


      <AttachmentUpload
        attachments={formData.attachments}
        onAdd={handleAddAttachments}
        onRemove={handleRemoveAttachment}
        onDownload={handleDownloadAttachment}
        maxFiles={10}
        maxSizeMB={10}
        acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
      />

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}
