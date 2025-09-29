import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Provider } from '@/api/entities';

export default function GameMixBulkEditForm({ onSubmit, onCancel, selectionCount }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    provider_id: '',
    game_count: '',
    status: '',
  });

  const [providers, setProviders] = useState([]);
  useEffect(() => {
    Provider.list().then(setProviders);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (dataToSubmit.game_count) {
      dataToSubmit.game_count = parseInt(dataToSubmit.game_count, 10);
    }
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      <p className="text-muted-foreground text-sm">
        Completați doar câmpurile pe care doriți să le actualizați pentru cele <strong>{selectionCount}</strong> mixuri de jocuri selectate. 
        Câmpurile lăsate goale nu vor fi modificate.
      </p>

      <div className="space-y-2">
        <Label htmlFor="name">Game Mix Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="provider_id">Provider</Label>
          <Select value={formData.provider_id} onValueChange={(value) => handleSelectChange('provider_id', value)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Păstrează valoarea originală" />
            </SelectTrigger>
            <SelectContent>
              {providers.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="game_count">Game Count</Label>
          <Input id="game_count" name="game_count" type="number" value={formData.game_count} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
          <SelectTrigger id="status" className="bg-input border-border">
            <SelectValue placeholder="Păstrează valoarea originală" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="deprecated">Deprecated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Selected Mixes</Button>
      </div>
    </form>
  );
}