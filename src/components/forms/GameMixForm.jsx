import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Provider, Platform } from '@/api/entities';

export default function GameMixForm({ gameMix, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    provider_id: '',
    platform_id: '',
    game_count: 0,
    games: '',
    status: 'active',
  });
  const [providers, setProviders] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [providerList, platformList] = await Promise.all([
        Provider.list(),
        Platform.list()
      ]);
      setProviders(providerList);
      setPlatforms(platformList);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (gameMix) {
      // Handle both array and string formats for games
      let gamesString = '';
      if (Array.isArray(gameMix.games)) {
        gamesString = gameMix.games.join('\n');
      } else if (typeof gameMix.games === 'string') {
        // If it's comma-separated, convert to line-separated
        gamesString = gameMix.games.replace(/,/g, '\n');
      }
      
      // Count by lines (rows), not by commas
      const gameCount = gamesString ? gamesString.split('\n').filter(game => game.trim() !== '').length : 0;
      
      setFormData({
        name: gameMix.name || '',
        description: gameMix.description || '',
        provider_id: gameMix.provider_id || '',
        platform_id: gameMix.platform_id || '',
        game_count: gameCount,
        games: gamesString,
        status: gameMix.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        provider_id: '',
        platform_id: '',
        game_count: 0,
        games: '',
        status: 'active',
      });
    }
  }, [gameMix]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Auto-calculate game count when games field changes
    if (name === 'games') {
      // Count by lines (rows), not by commas
      const gameCount = value ? value.split('\n').filter(game => game.trim() !== '').length : 0;
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        game_count: gameCount
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? parseInt(value) || 0 : value 
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Filter platforms based on selected provider
  const filteredPlatforms = formData.provider_id 
    ? platforms.filter(platform => platform.provider_id === formData.provider_id)
    : platforms;

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      games: formData.games.split('\n').map(game => game.trim()).filter(game => game.length > 0)
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Game Mix Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-input border-border" />
        </div>
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
                 <Label htmlFor="platform_id">Platform</Label>
                 <Select value={formData.platform_id} onValueChange={(value) => handleSelectChange('platform_id', value)}>
                   <SelectTrigger id="platform_id" className="bg-input border-border">
                     <SelectValue placeholder="Select a platform" />
                   </SelectTrigger>
                   <SelectContent>
                     {filteredPlatforms.map(platform => (
                       <SelectItem key={platform.id} value={platform.id}>{platform.name}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="bg-input border-border" rows={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="game_count">Game Count (Auto-calculated)</Label>
          <Input 
            id="game_count" 
            name="game_count" 
            type="number" 
            value={formData.game_count} 
            onChange={handleChange} 
            required 
            className="bg-input border-border" 
            readOnly
            placeholder="Calculated automatically from games list"
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
              <SelectItem value="deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="games">Games (comma-separated) - Game count will be calculated automatically</Label>
        <Textarea 
          id="games" 
          name="games" 
          value={formData.games} 
          onChange={handleChange} 
          className="bg-input border-border" 
          placeholder="Book of Ra, Sizzling Hot, Lucky Lady's Charm, Starburst, Gonzo's Quest..." 
          rows={3} 
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {gameMix ? 'Update Game Mix' : 'Create Game Mix'}
        </Button>
      </div>
    </form>
  );
}