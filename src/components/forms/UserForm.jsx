import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';

export default function UserForm({ user, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'operator',
    is_active: true,
    password: '',
    confirm_password: '',
    avatar: null
  });

  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'operator',
        is_active: user.is_active !== false,
        password: '',
        confirm_password: '',
        avatar: user.avatar || null
      });
      setAvatarPreview(user.avatar || null);
    } else {
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'operator',
        is_active: true,
        password: '',
        confirm_password: '',
        avatar: null
      });
      setAvatarPreview(null);
    }
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!user && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (!user && formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, is_active: value === 'active' }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please select a valid image file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Image size must be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64String = ev.target.result;
        setAvatarPreview(base64String);
        setFormData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);

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
    
    if (!validateForm()) {
      return;
    }

    // Remove confirm_password from formData before submitting
    const { confirm_password, ...submitData } = formData;
    
    // Don't include password if it's empty (for updates)
    if (!submitData.password) {
      delete submitData.password;
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-20 h-20 border-2 border-border">
            <AvatarImage src={avatarPreview} alt="User Avatar" />
            <AvatarFallback className="bg-primary text-white text-lg">
              {formData.first_name && formData.last_name 
                ? `${formData.first_name.charAt(0)}${formData.last_name.charAt(0)}` 
                : formData.username ? formData.username.charAt(0).toUpperCase() : 'U'
              }
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
          <Label className="text-foreground text-sm">Profile Picture</Label>
          <p className="text-muted-foreground text-xs mt-1">
            Upload a profile picture (JPG, PNG, GIF up to 5MB)
          </p>
          {errors.avatar && <p className="text-red-400 text-sm mt-1">{errors.avatar}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name" className="text-foreground">First Name *</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`bg-input border-border text-white ${errors.first_name ? 'border-red-500' : ''}`}
            placeholder="Enter first name"
          />
          {errors.first_name && <p className="text-red-400 text-sm mt-1">{errors.first_name}</p>}
        </div>

        <div>
          <Label htmlFor="last_name" className="text-foreground">Last Name *</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`bg-input border-border text-white ${errors.last_name ? 'border-red-500' : ''}`}
            placeholder="Enter last name"
          />
          {errors.last_name && <p className="text-red-400 text-sm mt-1">{errors.last_name}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="username" className="text-foreground">Username *</Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`bg-input border-border text-white ${errors.username ? 'border-red-500' : ''}`}
          placeholder="Enter username"
        />
        {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
      </div>

      <div>
        <Label htmlFor="email" className="text-foreground">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`bg-input border-border text-white ${errors.email ? 'border-red-500' : ''}`}
          placeholder="Enter email address"
        />
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
      </div>

      {!user && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password" className="text-foreground">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`bg-input border-border text-white ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <Label htmlFor="confirm_password" className="text-foreground">Confirm Password *</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={`bg-input border-border text-white ${errors.confirm_password ? 'border-red-500' : ''}`}
              placeholder="Confirm password"
            />
            {errors.confirm_password && <p className="text-red-400 text-sm mt-1">{errors.confirm_password}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role" className="text-foreground">Role</Label>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger className="bg-input border-border text-white">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="operator" className="text-white hover:bg-accent">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Operator
                </div>
              </SelectItem>
              <SelectItem value="manager" className="text-white hover:bg-accent">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Manager
                </div>
              </SelectItem>
              <SelectItem value="admin" className="text-white hover:bg-accent">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Admin
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status" className="text-foreground">Status</Label>
          <Select value={formData.is_active ? 'active' : 'inactive'} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-input border-border text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="active" className="text-white hover:bg-accent">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active
                </div>
              </SelectItem>
              <SelectItem value="inactive" className="text-white hover:bg-accent">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Inactive
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
        >
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
