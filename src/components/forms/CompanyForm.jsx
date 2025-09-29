import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AttachmentUpload from './AttachmentUpload';

export default function CompanyForm({ company, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    registration_number: '',
    tax_id: '',
    address: '',
    phone: '',
    email: '',
    contact_person: '',
    status: 'active',
    attachments: []
  });

  useEffect(() => {
    if (company) {
      setFormData(company);
    } else {
      setFormData({
        name: '',
        registration_number: '',
        tax_id: '',
        address: '',
        phone: '',
        email: '',
        contact_person: '',
        status: 'active',
        attachments: []
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAttachments = (newAttachments) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const handleRemoveAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  const handleDownloadAttachment = (attachment) => {
    // Create download link from base64 data
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Company Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input id="contact_person" name="contact_person" value={formData.contact_person} onChange={handleChange} className="bg-input border-border" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="registration_number">Registration Number</Label>
          <Input id="registration_number" name="registration_number" value={formData.registration_number} onChange={handleChange} required className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax_id">Tax ID</Label>
          <Input id="tax_id" name="tax_id" value={formData.tax_id} onChange={handleChange} className="bg-input border-border" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} className="bg-input border-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="bg-input border-border" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={handleStatusChange}>
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

      <AttachmentUpload
        attachments={formData.attachments}
        onAdd={handleAddAttachments}
        onRemove={handleRemoveAttachment}
        onDownload={handleDownloadAttachment}
        maxFiles={5}
        maxSizeMB={10}
        acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
      />

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {company ? 'Update Company' : 'Create Company'}
        </Button>
      </div>
    </form>
  );
}