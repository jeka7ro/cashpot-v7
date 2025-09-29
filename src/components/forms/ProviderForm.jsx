import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, X } from 'lucide-react';

export default function ProviderForm({ provider, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (provider) {
      setFormData({
        ...provider,
        avatar: provider.avatar || null
      });
      setAvatarPreview(provider.avatar || null);
    } else {
      setFormData({
        name: '',
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
        avatar: null
      });
      setAvatarPreview(null);
    }
    setErrors({});
  }, [provider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Image size must be less than 5MB' }));
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setAvatarPreview(base64String);
        setFormData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
      
      // Clear any previous avatar error
      if (errors.avatar) {
        setErrors(prev => ({ ...prev, avatar: '' }));
      }
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setFormData(prev => ({ ...prev, avatar: null }));
    
    // Clear the file input
    const fileInput = document.getElementById('avatar');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-20 h-20 border-2 border-border">
            <AvatarImage src={avatarPreview} alt="Provider Avatar" />
            <AvatarFallback className="bg-primary text-white text-lg">
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'P'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex gap-2">
            <label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center gap-2 px-3 py-1 bg-muted hover:bg-accent rounded-md transition-colors">
                <Camera size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Upload</span>
              </div>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            
            {avatarPreview && (
              <button
                type="button"
                onClick={removeAvatar}
                className="flex items-center gap-2 px-3 py-1 bg-red-700 hover:bg-red-600 rounded-md transition-colors"
              >
                <X size={14} className="text-white" />
                <span className="text-white text-sm">Remove</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <Label className="text-sm">Provider Logo</Label>
          <p className="text-muted-foreground text-xs mt-1">
            Upload a provider logo (JPG, PNG, GIF up to 5MB)
          </p>
          {errors.avatar && <p className="text-red-400 text-sm mt-1">{errors.avatar}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Provider Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_name">Legal Company Name</Label>
          <Input id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} required className="bg-input border-border" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contact_person">Contact Person</Label>
        <Input id="contact_person" name="contact_person" value={formData.contact_person} onChange={handleChange} className="bg-input border-border" />
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

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{provider ? 'Update Provider' : 'Create Provider'}</Button>
      </div>
    </form>
  );
}