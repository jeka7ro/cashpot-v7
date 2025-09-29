import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Provider } from '@/api/entities';
import AttachmentUpload from './AttachmentUpload';

export default function CabinetForm({ cabinet, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    provider_id: '',
    status: 'active',
    attachments: []
  });
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const providerList = await Provider.list();
      setProviders(providerList);
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    if (cabinet) {
      setFormData(cabinet);
    } else {
      setFormData({
        name: '',
        model: '',
        provider_id: '',
        status: 'active',
        attachments: []
      });
    }
  }, [cabinet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Cabinet Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model Number</Label>
          <Input id="model" name="model" value={formData.model} onChange={handleChange} className="bg-input border-border" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="provider_id">Provider</Label>
          <Select value={formData.provider_id} onValueChange={(value) => handleSelectChange('provider_id', value)} required>
            <SelectTrigger id="provider_id" className="bg-input border-border">
              <SelectValue placeholder="Select a provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map(provider => (
                <SelectItem key={provider.id} value={provider.id}>{provider.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          {cabinet ? 'Update Cabinet' : 'Create Cabinet'}
        </Button>
      </div>
    </form>
  );
}