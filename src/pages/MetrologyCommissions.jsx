import React, { useState, useEffect } from "react";
import { MetrologyCommission } from "@/api/entities";
import { Users, Calendar, AlertTriangle, Plus, Edit, Trash2 } from "lucide-react";
import { format, differenceInDays, addYears } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "../components/common/Modal";
import MetrologyCommissionForm from "../components/forms/MetrologyCommissionForm";

export default function MetrologyCommissionsPage() {
  const [commissions, setCommissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('MetrologyCommissions.loadData called');
      setIsLoading(true);
      const commissionsData = await MetrologyCommission.list();
      console.log('Loaded commissions data:', commissionsData);
      
      // Sort by created_date descending
      const sortedCommissions = commissionsData.sort((a, b) => 
        new Date(b.created_date || 0) - new Date(a.created_date || 0)
      );
      setCommissions(sortedCommissions);
    } catch (error) {
      console.error('Error loading commissions data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysLeft = (commission) => {
    if (!commission.data_expirare) return null;
    const expiryDate = new Date(commission.data_expirare);
    const today = new Date();
    return differenceInDays(expiryDate, today);
  };

  const getStatusColor = (daysLeft) => {
    if (daysLeft === null) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    if (daysLeft < 0) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    if (daysLeft <= 30) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  };

  const handleAdd = () => {
    setEditingCommission(null);
    setIsModalOpen(true);
  };

  const handleEdit = (commission) => {
    setEditingCommission(commission);
    setIsModalOpen(true);
  };

  const handleDelete = async (commission) => {
    if (window.confirm('Are you sure you want to delete this commission?')) {
      try {
        const result = await MetrologyCommission.delete(commission.id);
        if (result.success) {
          await loadData();
        } else {
          alert('Failed to delete commission.');
        }
      } catch (error) {
        console.error('Error deleting commission:', error);
        alert('Failed to delete commission: ' + error.message);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      console.log('MetrologyCommissions.handleFormSubmit called with:', formData);
      console.log('Editing commission:', editingCommission);
      
      if (editingCommission) {
        console.log('Updating commission with ID:', editingCommission.id);
        const result = await MetrologyCommission.update(editingCommission.id, formData);
        console.log('Commission update result:', result);
      } else {
        console.log('Creating new commission');
        const result = await MetrologyCommission.create(formData);
        console.log('Commission create result:', result);
      }
      
      console.log('Reloading data...');
      await loadData();
      console.log('Data reloaded, closing modal');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving commission:', error);
      alert('Failed to save commission: ' + error.message);
    }
  };

  const filteredCommissions = commissions.filter(commission =>
    commission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.serial_numbers?.some(sn => sn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Comisii</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by name or serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card border-border w-64"
          />
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Commission
          </Button>
        </div>
      </header>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-row">
              <TableHead className="text-muted-foreground">Denumire</TableHead>
              <TableHead className="text-muted-foreground">Data emitere</TableHead>
              <TableHead className="text-muted-foreground">Data expirare</TableHead>
              <TableHead className="text-muted-foreground">Serial Numbers</TableHead>
              <TableHead className="text-muted-foreground">Count</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-24"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-24"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-32"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-16"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-20"></div></TableCell>
                  <TableCell><div className="h-8 bg-muted rounded w-20 ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : (
              filteredCommissions.map(commission => {
                const daysLeft = getDaysLeft(commission);

                return (
                  <TableRow key={commission.id} className="border-border">
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {commission.name || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {commission.data_emitere ? format(new Date(commission.data_emitere), 'MMM d, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {commission.data_expirare ? format(new Date(commission.data_expirare), 'MMM d, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">
                        {commission.serial_numbers && commission.serial_numbers.length > 0 ? (
                          <div className="space-y-1">
                            {commission.serial_numbers.slice(0, 2).map((sn, idx) => (
                              <div key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {sn}
                              </div>
                            ))}
                            {commission.serial_numbers.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{commission.serial_numbers.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {commission.serial_count || (commission.serial_numbers ? commission.serial_numbers.length : 0)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(daysLeft)}>
                        {daysLeft !== null ? `${daysLeft} days left` : 'No date'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(commission)} className="hover:bg-muted">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(commission)} className="hover:bg-muted text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {filteredCommissions.length === 0 && !isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            No commissions found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCommission ? "Edit Commission" : "Add New Commission"}
      >
        <MetrologyCommissionForm
          commission={editingCommission}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
