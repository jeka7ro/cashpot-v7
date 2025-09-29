import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cabinet, GameMix, Provider, Location, Company } from '@/api/entities';

export default function SlotMachineForm({ slotMachine, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    cabinet_id: '',
    game_mix_id: '',
    provider_id: '',
    model: '',
    serial_number: '',
    denomination: 0.01,
    max_bet: 100.00,
    rtp: 96.00,
    gaming_places: 1,
    commission_date: '',
    invoice_number: '',
    location_id: '',
    production_year: new Date().getFullYear(),
    ownership_type: 'property',
    owner_company_id: '',
    lease_provider_id: '',
    lease_contract_number: '',
    status: 'active',
  });

  const [cabinets, setCabinets] = useState([]);
  const [gameMixes, setGameMixes] = useState([]);
  const [providers, setProviders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [cabinetList, gameMixList, providerList, locationList, companyList] = await Promise.all([
        Cabinet.list(),
        GameMix.list(),
        Provider.list(),
        Location.list(),
        Company.list()
      ]);
      setCabinets(cabinetList);
      setGameMixes(gameMixList);
      setProviders(providerList);
      setLocations(locationList);
      setCompanies(companyList);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (slotMachine) {
      setFormData({
        ...slotMachine,
        commission_date: slotMachine.commission_date ? slotMachine.commission_date.split('T')[0] : '',
      });
    } else {
      setFormData({
        cabinet_id: '',
        game_mix_id: '',
        provider_id: '',
        model: '',
        serial_number: '',
        denomination: 0.01,
        max_bet: 100.00,
        rtp: 96.00,
        gaming_places: 1,
        commission_date: '',
        invoice_number: '',
        location_id: '',
        production_year: new Date().getFullYear(),
        ownership_type: 'property',
        owner_company_id: '',
        lease_provider_id: '',
        lease_contract_number: '',
        status: 'active',
      });
    }
  }, [slotMachine]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
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
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="serial_number">Serial Number *</Label>
          <Input id="serial_number" name="serial_number" value={formData.serial_number} onChange={handleChange} required className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input id="model" name="model" value={formData.model} onChange={handleChange} required className="bg-input border-border" />
        </div>
      </div>
      
      {/* Equipment Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="provider_id">Provider *</Label>
          <Select value={formData.provider_id} onValueChange={(value) => handleSelectChange('provider_id', value)} required>
            <SelectTrigger id="provider_id" className="bg-input border-border">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map(provider => (
                <SelectItem key={provider.id} value={provider.id}>{provider.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cabinet_id">Cabinet *</Label>
          <Select value={formData.cabinet_id} onValueChange={(value) => handleSelectChange('cabinet_id', value)} required>
            <SelectTrigger id="cabinet_id" className="bg-input border-border">
              <SelectValue placeholder="Select cabinet" />
            </SelectTrigger>
            <SelectContent>
              {cabinets.map(cabinet => (
                <SelectItem key={cabinet.id} value={cabinet.id}>{cabinet.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="game_mix_id">Game Mix *</Label>
          <Select value={formData.game_mix_id} onValueChange={(value) => handleSelectChange('game_mix_id', value)} required>
            <SelectTrigger id="game_mix_id" className="bg-input border-border">
              <SelectValue placeholder="Select game mix" />
            </SelectTrigger>
            <SelectContent>
              {gameMixes.map(mix => (
                <SelectItem key={mix.id} value={mix.id}>{mix.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Game Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label htmlFor="denomination">Denomination</Label>
          <Input id="denomination" name="denomination" type="number" step="0.01" value={formData.denomination} onChange={handleChange} className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_bet">Max Bet</Label>
          <Input id="max_bet" name="max_bet" type="number" step="0.01" value={formData.max_bet} onChange={handleChange} className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rtp">RTP (%)</Label>
          <Input id="rtp" name="rtp" type="number" step="0.01" value={formData.rtp} onChange={handleChange} className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gaming_places">Gaming Places</Label>
          <Input id="gaming_places" name="gaming_places" type="number" value={formData.gaming_places} onChange={handleChange} className="bg-input border-border" />
        </div>
      </div>

      {/* Ownership Section */}
      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Ownership Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ownership_type">Ownership Type</Label>
            <Select value={formData.ownership_type} onValueChange={(value) => handleSelectChange('ownership_type', value)}>
              <SelectTrigger id="ownership_type" className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.ownership_type === 'property' ? (
            <div className="space-y-2">
              <Label htmlFor="owner_company_id">Owner Company</Label>
              <Select value={formData.owner_company_id} onValueChange={(value) => handleSelectChange('owner_company_id', value)}>
                <SelectTrigger id="owner_company_id" className="bg-input border-border">
                  <SelectValue placeholder="Select owner company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="lease_provider_id">Lease Provider</Label>
                <Select value={formData.lease_provider_id} onValueChange={(value) => handleSelectChange('lease_provider_id', value)}>
                  <SelectTrigger id="lease_provider_id" className="bg-input border-border">
                    <SelectValue placeholder="Select lease provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map(provider => (
                      <SelectItem key={provider.id} value={provider.id}>{provider.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lease_contract_number">Lease Contract Number</Label>
                <Input id="lease_contract_number" name="lease_contract_number" value={formData.lease_contract_number} onChange={handleChange} className="bg-input border-border" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="commission_date">Commission Date</Label>
          <Input id="commission_date" name="commission_date" type="date" value={formData.commission_date} onChange={handleChange} className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="production_year">Production Year</Label>
          <Input id="production_year" name="production_year" type="number" value={formData.production_year} onChange={handleChange} className="bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoice_number">Invoice Number</Label>
          <Input id="invoice_number" name="invoice_number" value={formData.invoice_number} onChange={handleChange} className="bg-input border-border" />
        </div>
      </div>

      {/* Location and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location_id">Location</Label>
          <Select value={formData.location_id || ''} onValueChange={(value) => handleSelectChange('location_id', value)}>
            <SelectTrigger id="location_id" className="bg-input border-border">
              <SelectValue placeholder="Select location or leave empty for warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Warehouse</SelectItem>
              {locations.map(location => (
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger id="status" className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {slotMachine ? 'Update Machine' : 'Create Machine'}
        </Button>
      </div>
    </form>
  );
}