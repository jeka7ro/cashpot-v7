
import React, { useState, useEffect } from "react";
import { Metrology, SlotMachine, MetrologyApproval, MetrologyCommission, MetrologyAuthority, MetrologySoftware } from "@/api/entities";
import { FlaskConical, Calendar, AlertTriangle, Plus, Edit, Trash2, Filter } from "lucide-react";
import { format, differenceInDays, addYears } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "../components/common/Modal";
import MetrologyForm from "../components/forms/MetrologyForm";


export default function MetrologyPage() {
  const [metrology, setMetrology] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [software, setSoftware] = useState([]);
  const [slotMachines, setSlotMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [metrologyData, approvalsData, commissionsData, authoritiesData, softwareData, machinesData] = await Promise.all([
        Metrology.list(),
        MetrologyApproval.list(),
        MetrologyCommission.list(),
        MetrologyAuthority.list(),
        MetrologySoftware.list(),
        SlotMachine.list()
      ]);
      
      // Sort all data by created_date descending
      const sortedMetrology = metrologyData.sort((a, b) => 
        new Date(b.created_date || 0) - new Date(a.created_date || 0)
      );
      const sortedApprovals = approvalsData.sort((a, b) => 
        new Date(b.created_date || 0) - new Date(a.created_date || 0)
      );
      const sortedCommissions = commissionsData.sort((a, b) => 
        new Date(b.created_date || 0) - new Date(a.created_date || 0)
      );
      const sortedAuthorities = authoritiesData.sort((a, b) => 
        new Date(b.created_date || 0) - new Date(a.created_date || 0)
      );
      const sortedSoftware = softwareData.sort((a, b) => 
        new Date(b.created_date || 0) - new Date(a.created_date || 0)
      );
      
      setMetrology(sortedMetrology);
      setApprovals(sortedApprovals);
      setCommissions(sortedCommissions);
      setAuthorities(sortedAuthorities);
      setSoftware(sortedSoftware);
      setSlotMachines(machinesData);
    } catch (error) {
      console.error('Error loading metrology data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show only metrology certificates
  const getAllMetrologyData = () => {
    const allData = [
      ...metrology.map(item => ({ ...item, type: 'certificate' }))
    ];
    return allData.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
  };

  // Filter data based on selected type and search term
  const getFilteredData = () => {
    let data = getAllMetrologyData();
    
    // Filter by type
    if (selectedType !== 'all') {
      data = data.filter(item => item.type === selectedType);
    }
    
    // Filter by search term - search in all fields with priority for serial number
    if (searchTerm) {
      data = data.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        
        // Priority search: serial number first
        if (item.serial_number?.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Then search in all other fields
        return (
          item.certificate_number?.toLowerCase().includes(searchLower) ||
          item.name?.toLowerCase().includes(searchLower) ||
          item.denumire?.toLowerCase().includes(searchLower) ||
          item.address?.toLowerCase().includes(searchLower) ||
          item.issuing_authority?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.certificate_type?.toLowerCase().includes(searchLower) ||
          item.status?.toLowerCase().includes(searchLower) ||
          item.calibration_interval?.toString().includes(searchLower) ||
          // Search in related entity names
          (item.approval_id && approvals.find(a => a.id === item.approval_id)?.denumire?.toLowerCase().includes(searchLower)) ||
          (item.authority_id && authorities.find(a => a.id === item.authority_id)?.name?.toLowerCase().includes(searchLower)) ||
          (item.software_id && software.find(s => s.id === item.software_id)?.name?.toLowerCase().includes(searchLower)) ||
          (item.commission_id && commissions.find(c => c.id === item.commission_id)?.name?.toLowerCase().includes(searchLower))
        );
      });
    }
    
    return data;
  };

  const handleAdd = () => {
    setEditingCertificate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingCertificate(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        let result;
        switch (item.type) {
          case 'certificate':
            result = await Metrology.delete(item.id);
            break;
          case 'approval':
            result = await MetrologyApproval.delete(item.id);
            break;
          case 'authority':
            result = await MetrologyAuthority.delete(item.id);
            break;
          case 'software':
            result = await MetrologySoftware.delete(item.id);
            break;
          default:
            throw new Error('Unknown item type');
        }
        
        if (result.success) {
          await loadData();
        } else {
          alert('Failed to delete item.');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item: ' + error.message);
      }
    }
  };
  
  const handleFormSubmit = async (formData) => {
    try {
      console.log('Metrology.handleFormSubmit called with:', formData);
      console.log('Editing item:', editingCertificate);
      
      if (editingCertificate) {
        console.log('Updating item with ID:', editingCertificate.id, 'Type:', editingCertificate.type);
        let result;
        switch (editingCertificate.type) {
          case 'certificate':
            result = await Metrology.update(editingCertificate.id, formData);
            break;
          case 'approval':
            result = await MetrologyApproval.update(editingCertificate.id, formData);
            break;
          case 'authority':
            result = await MetrologyAuthority.update(editingCertificate.id, formData);
            break;
          case 'software':
            result = await MetrologySoftware.update(editingCertificate.id, formData);
            break;
          default:
            throw new Error('Unknown item type');
        }
        console.log('Update result:', result);
      } else {
        console.log('Creating new item with type:', formData.type);
        let result;
        switch (formData.type) {
          case 'certificate':
            result = await Metrology.create(formData);
            break;
          case 'approval':
            result = await MetrologyApproval.create(formData);
            break;
          case 'authority':
            result = await MetrologyAuthority.create(formData);
            break;
          case 'software':
            result = await MetrologySoftware.create(formData);
            break;
          default:
            throw new Error('Unknown item type');
        }
        console.log('Create result:', result);
      }
      
      console.log('Reloading data...');
      await loadData();
      console.log('Data reloaded, closing modal');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item: ' + error.message);
    }
  };

  const handleCVTDateChange = async (cert, newDateStr) => {
    if (!newDateStr) return;
    try {
      const newDate = new Date(newDateStr);
      const expiryDate = addYears(newDate, 1);
      
      const updatedCert = {
        ...cert,
        cvt_date: newDate.toISOString().split('T')[0],
        expiry_date: expiryDate.toISOString().split('T')[0]
      };
      
      await Metrology.update(cert.id, updatedCert);
      await loadData();
    } catch (error) {
      console.error('Error updating CVT date:', error);
    }
  };

  const getDaysLeft = (cert) => {
    const expiry = cert.expiry_date || (cert.cvt_date ? addYears(new Date(cert.cvt_date), 1) : null);
    if (!expiry) return null;
    
    const daysLeft = differenceInDays(new Date(expiry), new Date());
    return daysLeft > 0 ? daysLeft : 0;
  };

  const getStatusColor = (daysLeft) => {
    if (daysLeft === null) return 'bg-background/30 text-muted-foreground border-border';
    if (daysLeft <= 30) return 'bg-red-900/30 text-red-300 border-red-700';
    if (daysLeft <= 90) return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
    return 'bg-green-900/30 text-green-300 border-green-700';
  };
  

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Metrology Certificates</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card border-border w-64"
          />
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </header>

       <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-row">
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">Name/Title</TableHead>
              <TableHead className="text-muted-foreground">Issue Date</TableHead>
              <TableHead className="text-muted-foreground">Expiry Date</TableHead>
              <TableHead className="text-muted-foreground">Details</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-1/2"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-24"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-24"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-32"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-20"></div></TableCell>
                  <TableCell><div className="h-8 bg-muted rounded w-20 ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : (
              getFilteredData().map(item => {
                const daysLeft = getDaysLeft(item);
                const expiryDate = item.expiry_date || (item.cvt_date ? addYears(new Date(item.cvt_date), 1) : null);

                return (
                  <TableRow key={item.id} className="border-border">
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {item.type === 'certificate' ? 'Certificate' :
                         item.type === 'approval' ? 'Aprobare' :
                         item.type === 'authority' ? 'Autoritate' :
                         item.type === 'software' ? 'Software' : 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {item.certificate_number || item.denumire || item.name || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {item.cvt_date ? format(new Date(item.cvt_date), 'MMM d, yyyy') :
                           item.data_emitere ? format(new Date(item.data_emitere), 'MMM d, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {expiryDate ? format(new Date(expiryDate), 'MMM d, yyyy') :
                           item.data_expirare ? format(new Date(item.data_expirare), 'MMM d, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">
                        {item.type === 'authority' ? (
                          <div className="text-xs text-muted-foreground">
                            {item.address || 'N/A'}
                          </div>
                        ) : item.type === 'software' ? (
                          <div className="text-sm">
                            {Array.isArray(item.serial_numbers) 
                              ? item.serial_numbers.join(', ') 
                              : item.serial_numbers || 'N/A'
                            }
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            {item.serial_number || 'N/A'}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(daysLeft)}>
                        {daysLeft !== null ? `${daysLeft} days left` : 'No date'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:bg-muted">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item)} className="hover:bg-muted text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        {getFilteredData().length === 0 && !isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            No items found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCertificate ? "Edit Certificate" : "Add New Certificate"}
      >
        <MetrologyForm
          certificate={editingCertificate}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
