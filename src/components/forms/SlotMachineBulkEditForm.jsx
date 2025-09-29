import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cabinet, GameMix, Provider, Location } from "@/api/entities";

export default function SlotMachineBulkEditForm({ onSubmit, onCancel, selectionCount }) {
  const [formData, setFormData] = useState({
    model: '',
    location_id: '',
    provider_id: '',
    cabinet_id: '',
    game_mix_id: '',
    status: '',
    production_year: '',
    denomination: '',
    max_bet: '',
    rtp: '',
    gaming_places: ''
  });

  const [cabinets, setCabinets] = useState([]);
  const [gameMixes, setGameMixes] = useState([]);
  const [providers, setProviders] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    Promise.all([
      Cabinet.list(), GameMix.list(), Provider.list(), Location.list()
    ]).then(([cabinetsData, gameMixesData, providersData, locationsData]) => {
      setCabinets(cabinetsData);
      setGameMixes(gameMixesData);
      setProviders(providersData);
      setLocations(locationsData);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    // Convert numeric fields from string
    ['production_year', 'denomination', 'max_bet', 'rtp', 'gaming_places'].forEach(field => {
      if (dataToSubmit[field]) {
        dataToSubmit[field] = parseFloat(dataToSubmit[field]);
      }
    });
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      <p className="text-muted-foreground text-sm">
        Completați doar câmpurile pe care doriți să le actualizați pentru cele <strong>{selectionCount}</strong> aparate selectate. 
        Câmpurile lăsate goale nu vor fi modificate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" name="model" value={formData.model} onChange={handleChange} className="bg-input border-border" placeholder="Păstrează valoarea originală"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location_id">Location</Label>
          <Select value={formData.location_id} onValueChange={(value) => handleSelectChange('location_id', value)}>
            <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Păstrează valoarea originală" /></SelectTrigger>
            <SelectContent>
              {locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="provider_id">Provider</Label>
          <Select value={formData.provider_id} onValueChange={(value) => handleSelectChange('provider_id', value)}>
            <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Păstrează valoarea originală" /></SelectTrigger>
            <SelectContent>
              {providers.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cabinet_id">Cabinet</Label>
          <Select value={formData.cabinet_id} onValueChange={(value) => handleSelectChange('cabinet_id', value)}>
            <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Păstrează valoarea originală" /></SelectTrigger>
            <SelectContent>
              {cabinets.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="game_mix_id">Game Mix</Label>
          <Select value={formData.game_mix_id} onValueChange={(value) => handleSelectChange('game_mix_id', value)}>
            <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Păstrează valoarea originală" /></SelectTrigger>
            <SelectContent>
              {gameMixes.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="space-y-2">
          <Label htmlFor="production_year">Year</Label>
          <Input id="production_year" name="production_year" type="number" value={formData.production_year} onChange={handleChange} className="bg-input border-border" placeholder="Original"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="denomination">Denom.</Label>
          <Input id="denomination" name="denomination" type="number" step="0.01" value={formData.denomination} onChange={handleChange} className="bg-input border-border" placeholder="Original"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_bet">Max Bet</Label>
          <Input id="max_bet" name="max_bet" type="number" value={formData.max_bet} onChange={handleChange} className="bg-input border-border" placeholder="Original"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rtp">RTP (%)</Label>
          <Input id="rtp" name="rtp" type="number" step="0.1" value={formData.rtp} onChange={handleChange} className="bg-input border-border" placeholder="Original"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gaming_places">Places</Label>
          <Input id="gaming_places" name="gaming_places" type="number" value={formData.gaming_places} onChange={handleChange} className="bg-input border-border" placeholder="Original"/>
        </div>
      </div>

       <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue placeholder="Păstrează valoarea originală" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="storage">Storage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Selected Machines</Button>
      </div>
    </form>
  );
}