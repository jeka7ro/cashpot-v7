import React, { useState, useEffect } from "react";
import { MetrologyApproval } from "@/api/entities";
import { FileCheck, Calendar, AlertTriangle, Plus, Edit, Trash2 } from "lucide-react";
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
import MetrologyApprovalForm from "../components/forms/MetrologyApprovalForm";

export default function MetrologyApprovalsPage() {
  const [approvals, setApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApproval, setEditingApproval] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('MetrologyApprovals.loadData called');
      setIsLoading(true);
      const approvalsData = await MetrologyApproval.list();
      console.log('Loaded approvals data:', approvalsData);
      
      // Sort by created_date descending
      const sortedApprovals = approvalsData.sort((a, b) => 
        new Date(b.created_date || 0) - new Date(a.created_date || 0)
      );
      setApprovals(sortedApprovals);
    } catch (error) {
      console.error('Error loading approvals data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysLeft = (approval) => {
    if (!approval.data_expirare) return null;
    const expiryDate = new Date(approval.data_expirare);
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
    setEditingApproval(null);
    setIsModalOpen(true);
  };

  const handleEdit = (approval) => {
    setEditingApproval(approval);
    setIsModalOpen(true);
  };

  const handleDelete = async (approval) => {
    if (window.confirm('Are you sure you want to delete this approval?')) {
      try {
        const result = await MetrologyApproval.delete(approval.id);
        if (result.success) {
          await loadData();
        } else {
          alert('Failed to delete approval.');
        }
      } catch (error) {
        console.error('Error deleting approval:', error);
        alert('Failed to delete approval: ' + error.message);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      console.log('MetrologyApprovals.handleFormSubmit called with:', formData);
      console.log('Editing approval:', editingApproval);
      
      if (editingApproval) {
        console.log('Updating approval with ID:', editingApproval.id);
        const result = await MetrologyApproval.update(editingApproval.id, formData);
        console.log('Approval update result:', result);
      } else {
        console.log('Creating new approval');
        const result = await MetrologyApproval.create(formData);
        console.log('Approval create result:', result);
      }
      
      console.log('Reloading data...');
      await loadData();
      console.log('Data reloaded, closing modal');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving approval:', error);
      alert('Failed to save approval: ' + error.message);
    }
  };

  const filteredApprovals = approvals.filter(approval =>
    approval.denumire?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Aprobări de tip</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card border-border w-64"
          />
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Approval
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
                  <TableCell><div className="h-4 bg-muted rounded w-20"></div></TableCell>
                  <TableCell><div className="h-8 bg-muted rounded w-20 ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : (
              filteredApprovals.map(approval => {
                const daysLeft = getDaysLeft(approval);

                return (
                  <TableRow key={approval.id} className="border-border">
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {approval.denumire || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {approval.data_emitere ? format(new Date(approval.data_emitere), 'MMM d, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {approval.data_expirare ? format(new Date(approval.data_expirare), 'MMM d, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(daysLeft)}>
                        {daysLeft !== null ? `${daysLeft} days left` : 'No date'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(approval)} className="hover:bg-muted">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(approval)} className="hover:bg-muted text-red-400 hover:text-red-300">
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
        {filteredApprovals.length === 0 && !isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            No approvals found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApproval ? "Edit Approval" : "Add New Approval"}
      >
        <MetrologyApprovalForm
          approval={editingApproval}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
