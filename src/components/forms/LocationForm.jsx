import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Company } from '@/api/entities';
import AttachmentUpload from './AttachmentUpload';

export default function LocationForm({ location, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    county: '',
    country: 'Romania',
    postal_code: '',
    company_id: '',
    status: 'active',
    attachments: []
  });
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const companyList = await Company.list();
      setCompanies(companyList);
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (location) {
      setFormData(location);
    } else {
      setFormData({
        name: '',
        address: '',
        city: '',
        county: '',
        country: 'Romania',
        postal_code: '',
        company_id: '',
        status: 'active',
        attachments: []
      });
    }
  }, [location]);

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

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Location Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-input border-border" />
        </div>
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
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} required className="bg-input border-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} required className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="county">County</Label>
          <Input id="county" name="county" value={formData.county} onChange={handleChange} required className="bg-input border-border" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" value={formData.country} onChange={handleChange} className="bg-input border-border" />
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
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
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
          {location ? 'Update Location' : 'Create Location'}
        </Button>
      </div>
    </form>
  );
}