import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AttachmentUpload from './AttachmentUpload';
import { MetrologyApproval, MetrologyAuthority, MetrologySoftware, MetrologyCommission } from '@/api/entities';

export default function MetrologyForm({ certificate, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'certificate',
    serial_number: '',
    certificate_number: '',
    certificate_type: 'calibration',
    issue_date: '',
    expiry_date: '',
    cvt_date: '',
    issuing_authority: '',
    calibration_interval: 12,
    status: 'active',
    description: '',
    attachments: [],
        approval_id: 'none', // For linking to approval
    authority_id: 'none', // For linking to authority
    software_id: 'none', // For linking to software
    commission_id: 'none', // For linking to commission
    // For approvals
    denumire: '',
    data_emitere: '',
    data_expirare: '',
    // For commissions
    name: '',
    data_emitere: '',
    data_expirare: '',
    serial_numbers: [''],
    // For authorities
    name: '',
    address: '',
    // For software
    provider_id: 'none',
    cabinet_id: 'none',
    game_mix_id: 'none',
    serial_numbers: ''
  });
  
  const [approvals, setApprovals] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [software, setSoftware] = useState([]);
  const [commissions, setCommissions] = useState([]);

  // Load data for dropdowns
  useEffect(() => {
    const loadData = async () => {
      try {
        const [approvalsData, authoritiesData, softwareData, commissionsData] = await Promise.all([
          MetrologyApproval.list(),
          MetrologyAuthority.list(),
          MetrologySoftware.list(),
          MetrologyCommission.list()
        ]);
        setApprovals(approvalsData);
        setAuthorities(authoritiesData);
        setSoftware(softwareData);
        setCommissions(commissionsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (certificate) {
      setFormData({
        ...certificate,
        issue_date: certificate.issue_date ? certificate.issue_date.split('T')[0] : '',
        expiry_date: certificate.expiry_date ? certificate.expiry_date.split('T')[0] : '',
        cvt_date: certificate.cvt_date ? certificate.cvt_date.split('T')[0] : '',
        data_emitere: certificate.data_emitere ? certificate.data_emitere.split('T')[0] : '',
        data_expirare: certificate.data_expirare ? certificate.data_expirare.split('T')[0] : '',
        approval_id: certificate.approval_id || 'none',
        authority_id: certificate.authority_id || 'none',
        software_id: certificate.software_id || 'none',
        commission_id: certificate.commission_id || 'none',
        provider_id: certificate.provider_id || 'none',
        cabinet_id: certificate.cabinet_id || 'none',
        game_mix_id: certificate.game_mix_id || 'none'
      });
    } else {
      setFormData({
        type: 'certificate',
        serial_number: '',
        certificate_number: '',
        certificate_type: 'calibration',
        issue_date: '',
        expiry_date: '',
        cvt_date: '',
        issuing_authority: '',
        calibration_interval: 12,
        status: 'active',
        description: '',
        attachments: [],
        denumire: '',
        data_emitere: '',
        data_expirare: '',
        name: '',
        serial_numbers: [''],
        address: ''
      });
    }
  }, [certificate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Auto-calculate expiry date when issue date changes
    if (name === 'issue_date' && value) {
      const issueDate = new Date(value);
      const expiryDate = new Date(issueDate);
      expiryDate.setDate(expiryDate.getDate() + 365); // Add 365 days
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        expiry_date: expiryDate.toISOString().split('T')[0]
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

  const handleTypeChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      type: value,
      // Reset specific fields when changing type
      serial_numbers: value === 'commission' ? [''] : prev.serial_numbers,
      address: value === 'authority' ? '' : prev.address
    }));
  };

  const handleSerialNumberChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      serial_numbers: prev.serial_numbers.map((sn, i) => i === index ? value : sn)
    }));
  };

  const addSerialNumber = () => {
    setFormData(prev => ({
      ...prev,
      serial_numbers: [...prev.serial_numbers, '']
    }));
  };

  const removeSerialNumber = (index) => {
    setFormData(prev => ({
      ...prev,
      serial_numbers: prev.serial_numbers.filter((_, i) => i !== index)
    }));
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
    const submitData = {
      ...formData,
      approval_id: formData.approval_id === 'none' ? '' : formData.approval_id,
      authority_id: formData.authority_id === 'none' ? '' : formData.authority_id,
      software_id: formData.software_id === 'none' ? '' : formData.software_id,
      commission_id: formData.commission_id === 'none' ? '' : formData.commission_id,
      provider_id: formData.provider_id === 'none' ? '' : formData.provider_id,
      cabinet_id: formData.cabinet_id === 'none' ? '' : formData.cabinet_id,
      game_mix_id: formData.game_mix_id === 'none' ? '' : formData.game_mix_id
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
      {/* Type Selection - Only Certificate */}
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select value={formData.type} onValueChange={handleTypeChange} required>
          <SelectTrigger id="type" className="bg-input border-border">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="certificate">Certificate</SelectItem>
            <SelectItem value="approval">Aprobare de tip</SelectItem>
            <SelectItem value="authority">Autoritate Metrologică</SelectItem>
            <SelectItem value="software">Software</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic fields based on type */}
      {formData.type === 'certificate' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input id="serial_number" name="serial_number" value={formData.serial_number} onChange={handleChange} required className="bg-input border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificate_number">Certificate Number</Label>
              <Input id="certificate_number" name="certificate_number" value={formData.certificate_number} onChange={handleChange} required className="bg-input border-border" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="approval_id">Aprobare de tip (opțional)</Label>
            <Select value={formData.approval_id} onValueChange={(value) => handleSelectChange('approval_id', value)}>
              <SelectTrigger id="approval_id" className="bg-input border-border">
                <SelectValue placeholder="Selectează o aprobare de tip" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Fără aprobare</SelectItem>
                {approvals.map(approval => (
                  <SelectItem key={approval.id} value={approval.id}>
                    {approval.denumire} ({approval.data_emitere ? new Date(approval.data_emitere).toLocaleDateString() : 'N/A'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="software_id">Software (opțional)</Label>
            <Select value={formData.software_id} onValueChange={(value) => handleSelectChange('software_id', value)}>
              <SelectTrigger id="software_id" className="bg-input border-border">
                <SelectValue placeholder="Selectează software" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Fără software</SelectItem>
                {software.map(sw => (
                  <SelectItem key={sw.id} value={sw.id}>
                    {sw.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="commission_id">Comisie (opțional)</Label>
            <Select value={formData.commission_id} onValueChange={(value) => handleSelectChange('commission_id', value)}>
              <SelectTrigger id="commission_id" className="bg-input border-border">
                <SelectValue placeholder="Selectează o comisie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Fără comisie</SelectItem>
                {commissions.map(commission => (
                  <SelectItem key={commission.id} value={commission.id}>
                    {commission.name} ({commission.data_emitere ? new Date(commission.data_emitere).toLocaleDateString() : 'N/A'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {formData.type === 'approval' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="denumire">Denumire</Label>
            <Input id="denumire" name="denumire" value={formData.denumire} onChange={handleChange} required className="bg-input border-border" />
          </div>
        </>
      )}

      {formData.type === 'commission' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Denumire</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-input border-border" />
          </div>
        </>
      )}

      {formData.type === 'authority' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Nume</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-input border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresă</Label>
            <Textarea id="address" name="address" value={formData.address} onChange={handleChange} required className="bg-input border-border" rows={3} />
          </div>
        </>
      )}

      {formData.type === 'software' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Nume Software</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-input border-border" />
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
                  {/* Providers will be loaded from entities */}
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
                  {/* Cabinets will be loaded from entities */}
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
                {/* Game mixes will be loaded from entities */}
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
              value={formData.serial_numbers || ''} 
              onChange={handleChange} 
              className="bg-input border-border" 
              placeholder="134862&#10;134863&#10;134864&#10;134865..." 
              rows={4} 
            />
            <p className="text-xs text-muted-foreground">
              Enter one serial number per line. Count will be calculated automatically.
            </p>
          </div>
        </>
      )}
      

      {/* Special fields for certificate */}
      {formData.type === 'certificate' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="certificate_type">Certificate Type</Label>
              <Select value={formData.certificate_type} onValueChange={(value) => handleSelectChange('certificate_type', value)} required>
                <SelectTrigger id="certificate_type" className="bg-input border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calibration">Calibration</SelectItem>
                  <SelectItem value="verification">Verification</SelectItem>
                  <SelectItem value="validation">Validation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="authority_id">Issuing Authority (opțional)</Label>
              <Select value={formData.authority_id} onValueChange={(value) => handleSelectChange('authority_id', value)}>
                <SelectTrigger id="authority_id" className="bg-input border-border">
                  <SelectValue placeholder="Selectează o autoritate metrologică" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Fără autoritate</SelectItem>
                  {authorities.map(authority => (
                    <SelectItem key={authority.id} value={authority.id}>
                      {authority.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input id="issue_date" name="issue_date" type="date" value={formData.issue_date} onChange={handleChange} className="bg-input border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvt_date">CVT Date</Label>
              <Input id="cvt_date" name="cvt_date" type="date" value={formData.cvt_date} onChange={handleChange} className="bg-input border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date (Auto-calculated)</Label>
              <Input 
                id="expiry_date" 
                name="expiry_date" 
                type="date" 
                value={formData.expiry_date} 
                onChange={handleChange} 
                className="bg-input border-border" 
                readOnly
                placeholder="Calculated automatically (365 days after issue date)"
              />
            </div>
          </div>
        </>
      )}

      {/* Serial numbers for commission */}
      {formData.type === 'commission' && (
        <div className="space-y-2">
          <Label>Serial Numbers</Label>
          <div className="space-y-2">
            {formData.serial_numbers.map((sn, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={sn}
                  onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                  placeholder={`Serial number ${index + 1}`}
                  className="bg-input border-border"
                />
                {formData.serial_numbers.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSerialNumber(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSerialNumber}
              className="text-blue-600 hover:text-blue-700"
            >
              Add Serial Number
            </Button>
          </div>
        </div>
      )}

      {/* Status and other common fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger id="status" className="bg-input border-border">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.type === 'certificate' && (
          <div className="space-y-2">
            <Label htmlFor="calibration_interval">Calibration Interval (months)</Label>
            <Input id="calibration_interval" name="calibration_interval" type="number" value={formData.calibration_interval} onChange={handleChange} className="bg-input border-border" />
          </div>
        )}
      </div>

      {formData.type === 'certificate' && (
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="bg-input border-border" rows={3} />
        </div>
      )}

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
          {certificate ? 'Update Certificate' : 'Create Certificate'}
        </Button>
      </div>
    </form>
  );
}