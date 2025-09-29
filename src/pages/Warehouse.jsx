
import React, { useState, useEffect } from "react";
import { SlotMachine, Provider, Location } from "@/api/entities";
import { Search, Plus, Edit, Eye, Package, MapPin, AlertCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "../components/common/Modal";
import SlotMachineForm from "../components/forms/SlotMachineForm";

export default function Warehouse() {
  const [machines, setMachines] = useState([]);
  const [providers, setProviders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [machinesData, providersData, locationsData] = await Promise.all([
        SlotMachine.list('-created_date'),
        Provider.list(),
        Location.list()
      ]);
      
      const warehouseMachines = machinesData.filter(machine => 
        machine.status === 'storage' || !machine.location_id
      );
      
      setMachines(warehouseMachines);
      setProviders(providersData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Error loading warehouse data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMachine(null);
    setIsModalOpen(true);
  };

  const handleEdit = (machine) => {
    setEditingMachine(machine);
    setIsModalOpen(true);
  };

  const handleDelete = async (machineId) => {
    if (window.confirm('Are you sure you want to delete this machine from the records?')) {
      try {
        await SlotMachine.delete(machineId);
        await loadData();
      } catch (error) {
        console.error('Error deleting machine:', error);
        alert('Failed to delete machine.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingMachine) {
        await SlotMachine.update(editingMachine.id, { ...formData, status: formData.status || 'storage' });
      } else {
        await SlotMachine.create({ ...formData, status: 'storage' });
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving machine:', error);
      alert('Failed to save machine.');
    }
  };

  const getProviderName = (providerId) => {
    const provider = providers.find(p => p.id === providerId);
    return provider?.name || 'Unknown Provider';
  };

  const getLocationName = (locationId) => {
    if (!locationId) return 'Warehouse';
    const location = locations.find(l => l.id === locationId);
    return location?.name || 'Unknown Location';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'storage': return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'maintenance': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'retired': return 'bg-red-900/30 text-red-300 border-red-700';
      case 'transit': return 'bg-purple-900/30 text-purple-300 border-purple-700';
      default: return 'bg-background/30 text-muted-foreground border-border';
    }
  };

  const filteredMachines = machines.filter(machine => 
    (machine.serial_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (machine.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProviderName(machine.provider_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-card rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <style>{`
        .warehouse-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .warehouse-title {
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
        }
        
        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .search-container {
          position: relative;
          width: 280px;
        }
        
        .search-input {
          background: #334155;
          border: 1px solid #475569;
          color: #f8fafc;
          padding: 8px 12px 8px 40px;
          border-radius: 6px;
          font-size: 14px;
          width: 100%;
        }
        
        .search-input::placeholder {
          color: #94a3b8;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          width: 16px;
          height: 16px;
        }
        
        .action-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .action-button:hover {
          background: #2563eb;
        }
        
        .warehouse-table {
          background: #1e293b;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #334155;
        }
        
        .table-header {
          background: #0f172a;
          border-bottom: 1px solid #334155;
        }
        
        .table-header th {
          padding: 16px;
          text-align: left;
          font-weight: 600;
          color: #94a3b8;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .table-row {
          border-bottom: 1px solid #334155;
          transition: background-color 0.2s;
        }
        
        .table-row:hover {
          background: rgba(59, 130, 246, 0.05);
        }
        
        .table-cell {
          padding: 16px;
          vertical-align: middle;
        }
        
        .machine-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .machine-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .machine-details h4 {
          font-weight: 500;
          color: #f8fafc;
          margin: 0;
          font-size: 14px;
        }
        
        .machine-details p {
          color: #94a3b8;
          margin: 2px 0 0 0;
          font-size: 12px;
        }
        
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .icon-button {
          width: 32px;
          height: 32px;
          background: #374151;
          border: 1px solid #4b5563;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .icon-button:hover {
          background: #4b5563;
          border-color: #6b7280;
        }
        
        .stats-banner {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 4px;
        }
        
        .stat-label {
          color: #94a3b8;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="warehouse-header">
        <h1 className="warehouse-title">Warehouse</h1>
        <div className="header-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search warehouse inventory..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="action-button" onClick={handleAdd}>
            <Plus size={16} />
            Add to Warehouse
          </button>
        </div>
      </div>

      <div className="stats-banner">
        <div className="stat-item">
          <div className="stat-value">{machines.length}</div>
          <div className="stat-label">Total Machines</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{machines.filter(m => m.status === 'storage').length}</div>
          <div className="stat-label">In Storage</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{machines.filter(m => m.status === 'maintenance').length}</div>
          <div className="stat-label">Maintenance</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{machines.filter(m => !m.location_id).length}</div>
          <div className="stat-label">Unassigned</div>
        </div>
      </div>

      <div className="warehouse-table">
        <Table>
          <TableHeader className="table-header">
            <TableRow>
              <TableHead>Machine</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Production Year</TableHead>
              <TableHead>Current Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines.map((machine) => (
              <TableRow key={machine.id} className="table-row">
                <TableCell className="table-cell">
                  <div className="machine-info">
                    <div className="machine-avatar">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="machine-details">
                      <h4>{machine.serial_number}</h4>
                      <p>{machine.model}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="table-cell">
                  <span className="text-foreground">{getProviderName(machine.provider_id)}</span>
                </TableCell>
                <TableCell className="table-cell">
                  <span className="text-muted-foreground">{machine.production_year || 'N/A'}</span>
                </TableCell>
                <TableCell className="table-cell">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{getLocationName(machine.location_id)}</span>
                  </div>
                </TableCell>
                <TableCell className="table-cell">
                  <Badge className={`status-badge ${getStatusColor(machine.status)}`}>
                    {machine.status || 'storage'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(machine)} className="hover:bg-muted">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(machine.id)} className="hover:bg-muted text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredMachines.length === 0 && !isLoading && (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Warehouse is empty</h3>
            <p className="text-muted-foreground">No machines currently in storage or maintenance.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMachine ? "Edit Warehouse Item" : "Add to Warehouse"}
      >
        <SlotMachineForm
          slotMachine={editingMachine}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
}
