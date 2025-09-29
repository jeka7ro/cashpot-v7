
import React, { useState, useEffect } from "react";
import { Jackpot, SlotMachine } from "@/api/entities";
import { Search, Plus, Edit, Eye, Trophy, TrendingUp, DollarSign } from "lucide-react";
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

export default function Jackpots() {
  const [jackpots, setJackpots] = useState([]);
  const [slotMachines, setSlotMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [jackpotsData, machinesData] = await Promise.all([
        Jackpot.list('-created_date'),
        SlotMachine.list()
      ]);
      setJackpots(jackpotsData);
      setSlotMachines(machinesData);
    } catch (error) {
      console.error('Error loading jackpots data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMachineModel = (serialNumber) => {
    const machine = slotMachines.find(m => m.serial_number === serialNumber);
    return machine?.model || 'Unknown Machine';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'triggered': return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'reset': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'maintenance': return 'bg-red-900/30 text-red-300 border-red-700';
      default: return 'bg-background/30 text-muted-foreground border-border';
    }
  };

  const getJackpotTypeColor = (type) => {
    switch(type) {
      case 'progressive': return 'bg-purple-900/30 text-purple-300 border-purple-700';
      case 'fixed': return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'mystery': return 'bg-orange-900/30 text-orange-300 border-orange-700';
      default: return 'bg-background/30 text-muted-foreground border-border';
    }
  };

  const filteredJackpots = jackpots.filter(jackpot => 
    (jackpot.serial_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (jackpot.jackpot_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (jackpot.jackpot_type || '').toLowerCase().includes(searchTerm.toLowerCase())
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
        .jackpots-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .jackpots-title {
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
        
        .jackpots-table {
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
          background: linear-gradient(135deg, #f59e0b, #d97706);
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
        
        .jackpot-amount {
          font-family: 'Monaco', 'Menlo', monospace;
          font-weight: 700;
          font-size: 16px;
          color: #fbbf24;
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
      `}</style>

      <div className="jackpots-header">
        <h1 className="jackpots-title">Jackpots</h1>
        <div className="header-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search jackpots..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="action-button">
            <Plus size={16} />
            Add Jackpot
          </button>
        </div>
      </div>

      <div className="jackpots-table">
        <Table>
          <TableHeader className="table-header">
            <TableRow>
              <TableHead className="w-8">
                <input type="checkbox" className="w-4 h-4" />
              </TableHead>
              <TableHead>#</TableHead>
              <TableHead>Machine</TableHead>
              <TableHead>Jackpot Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Current Amount</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJackpots.map((jackpot, index) => (
              <TableRow key={jackpot.id} className="table-row">
                <TableCell className="table-cell">
                  <input type="checkbox" className="w-4 h-4" />
                </TableCell>
                <TableCell className="table-cell">
                  <span className="text-muted-foreground font-mono text-sm">{index + 1}</span>
                </TableCell>
                <TableCell className="table-cell">
                  <div className="machine-info">
                    <div className="machine-avatar">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="machine-details">
                      <h4>{jackpot.serial_number}</h4>
                      <p>{getMachineModel(jackpot.serial_number)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="table-cell">
                  <div>
                    <div className="text-foreground font-medium">{jackpot.jackpot_name}</div>
                    <div className="text-muted-foreground text-sm">{jackpot.description}</div>
                  </div>
                </TableCell>
                <TableCell className="table-cell">
                  <Badge className={`status-badge ${getJackpotTypeColor(jackpot.jackpot_type)}`}>
                    {jackpot.jackpot_type}
                  </Badge>
                </TableCell>
                <TableCell className="table-cell">
                  <div className="jackpot-amount">€{jackpot.current_amount?.toLocaleString()}</div>
                  <div className="text-muted-foreground text-xs">
                    Max: €{jackpot.max_amount?.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="table-cell">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min((jackpot.current_amount / jackpot.max_amount) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round((jackpot.current_amount / jackpot.max_amount) * 100)}%
                  </div>
                </TableCell>
                <TableCell className="table-cell">
                  <Badge className={`status-badge ${getStatusColor(jackpot.status)}`}>
                    {jackpot.status}
                  </Badge>
                </TableCell>
                <TableCell className="table-cell">
                  <div className="action-buttons">
                    <button className="icon-button">
                      <Eye size={14} className="text-muted-foreground" />
                    </button>
                    <button className="icon-button">
                      <Edit size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredJackpots.length === 0 && (
          <div className="p-12 text-center">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No jackpots found</h3>
            <p className="text-muted-foreground">Start by adding your first jackpot configuration.</p>
          </div>
        )}
      </div>
    </div>
  );
}
