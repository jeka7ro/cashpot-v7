import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Provider, Cabinet, GameMix } from '@/api/entities';

export default function MetrologySoftwareForm({ software, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    provider_id: '',
    cabinet_id: '',
    game_mix_id: '',
    serial_numbers: '',
    status: 'active'
  });
  
  const [providers, setProviders] = useState([]);
  const [cabinets, setCabinets] = useState([]);
  const [gameMixes, setGameMixes] = useState([]);

  // Load data for dropdowns
  useEffect(() => {
    const loadData = async () => {
      try {
        const [providersData, cabinetsData, gameMixesData] = await Promise.all([
          Provider.list(),
          Cabinet.list(),
          GameMix.list()
        ]);
        setProviders(providersData);
        setCabinets(cabinetsData);
        setGameMixes(gameMixesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (software) {
      // Handle both array and string formats for serial_numbers
      let serialNumbersString = '';
      if (Array.isArray(software.serial_numbers)) {
        serialNumbersString = software.serial_numbers.join('\n');
      } else if (typeof software.serial_numbers === 'string') {
        serialNumbersString = software.serial_numbers;
      }
      
      setFormData({
        ...software,
        provider_id: software.provider_id || 'none',
        cabinet_id: software.cabinet_id || 'none',
        game_mix_id: software.game_mix_id || 'none',
        serial_numbers: serialNumbersString
      });
    } else {
      setFormData({
        name: '',
        provider_id: 'none',
        cabinet_id: 'none',
        game_mix_id: 'none',
        serial_numbers: '',
        status: 'active'
      });
    }
  }, [software]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      provider_id: formData.provider_id === 'none' ? '' : formData.provider_id,
      cabinet_id: formData.cabinet_id === 'none' ? '' : formData.cabinet_id,
      game_mix_id: formData.game_mix_id === 'none' ? '' : formData.game_mix_id,
      serial_numbers: formData.serial_numbers.split('\n').map(sn => sn.trim()).filter(sn => sn.length > 0)
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      <div className="space-y-2">
        <Label htmlFor="name">Nume Software *</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          className="bg-input border-border" 
          placeholder="Enter software name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="provider_id">Provider</Label>
          <Select value={formData.provider_id} onValueChange={(value) => handleSelectChange('provider_id', value)}>
            <SelectTrigger id="provider_id" className="bg-input border-border">
              <SelectValue placeholder="Selectează provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Fără provider</SelectItem>
              {providers.map(provider => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cabinet_id">Cabinet</Label>
          <Select value={formData.cabinet_id} onValueChange={(value) => handleSelectChange('cabinet_id', value)}>
            <SelectTrigger id="cabinet_id" className="bg-input border-border">
              <SelectValue placeholder="Selectează cabinet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Fără cabinet</SelectItem>
              {cabinets.map(cabinet => (
                <SelectItem key={cabinet.id} value={cabinet.id}>
                  {cabinet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="game_mix_id">Game Mix</Label>
        <Select value={formData.game_mix_id} onValueChange={(value) => handleSelectChange('game_mix_id', value)}>
          <SelectTrigger id="game_mix_id" className="bg-input border-border">
            <SelectValue placeholder="Selectează game mix" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Fără game mix</SelectItem>
            {gameMixes.map(gameMix => (
              <SelectItem key={gameMix.id} value={gameMix.id}>
                {gameMix.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="serial_numbers">Serial Numbers (one per line)</Label>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {formData.serial_numbers ? formData.serial_numbers.split('\n').filter(sn => sn.trim() !== '').length : 0} serii
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
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {software ? 'Update Software' : 'Create Software'}
        </Button>
      </div>
    </form>
  );
}
