import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { Building2, Search, Plus, Edit, Trash2, Eye } from "lucide-react";
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
import CompanyForm from "../components/forms/CompanyForm";
import CompanyBulkEditForm from "../components/forms/CompanyBulkEditForm";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await Company.list('-created_date');
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await Company.delete(companyId);
        await loadCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Failed to delete company.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCompany) {
        await Company.update(editingCompany.id, formData);
      } else {
        await Company.create(formData);
      }
      await loadCompanies();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Failed to save company.');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allCompanyIds = filteredCompanies.map(c => c.id);
      setSelectedCompanies(allCompanyIds);
    } else {
      setSelectedCompanies([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter(companyId => companyId !== id));
    } else {
      setSelectedCompanies([...selectedCompanies, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCompanies.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedCompanies.length} companies?`)) {
      try {
        setIsLoading(true);
        await Promise.all(selectedCompanies.map(id => Company.delete(id)));
        await loadCompanies();
        setSelectedCompanies([]);
      } catch (error) {
        console.error('Error deleting companies:', error);
        alert('Failed to delete companies.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBulkEditSubmit = async (formData) => {
    const updates = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (Object.keys(updates).length === 0) {
      setIsBulkEditModalOpen(false);
      return;
    }

    try {
      setIsLoading(true);
      await Promise.all(selectedCompanies.map(id => Company.update(id, updates)));
      await loadCompanies();
      setIsBulkEditModalOpen(false);
      setSelectedCompanies([]);
    } catch (error) {
      console.error('Error bulk editing companies:', error);
      alert('Failed to bulk edit companies.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'inactive': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'suspended': return 'bg-red-900/30 text-red-300 border-red-700';
      default: return 'bg-background/30 text-muted-foreground border-border';
    }
  };

  const filteredCompanies = companies.filter(company =>
    (company.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.contact_person || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Companies</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border-border pl-9"
            />
          </div>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Button>
          <Button 
            onClick={() => setIsBulkEditModalOpen(true)}
            disabled={selectedCompanies.length === 0}
            variant="outline"
            className="border-border bg-card hover:bg-muted"
          >
            <Edit className="w-4 h-4 mr-2" />
            Bulk Edit ({selectedCompanies.length})
          </Button>
          <Button 
            onClick={handleBulkDelete}
            disabled={selectedCompanies.length === 0}
            variant="destructive"
            className="bg-red-800/80 hover:bg-red-800"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Bulk Delete ({selectedCompanies.length})
          </Button>
        </div>
      </header>

      <div className="table-container">
        <Table>
          <TableHeader className="table-header">
            <TableRow className="table-row">
              <TableHead className="w-12 text-center table-cell">
                <input 
                  type="checkbox" 
                  className="bg-muted border-border rounded"
                  onChange={handleSelectAll}
                  checked={filteredCompanies.length > 0 && selectedCompanies.length === filteredCompanies.length}
                  ref={input => {
                    if (input) {
                      input.indeterminate = selectedCompanies.length > 0 && selectedCompanies.length < filteredCompanies.length;
                    }
                  }}
                />
              </TableHead>
              <TableHead className="table-cell">Company</TableHead>
              <TableHead className="table-cell">Registration</TableHead>
              <TableHead className="table-cell">Contact</TableHead>
              <TableHead className="table-cell">Status</TableHead>
              <TableHead className="table-cell">Created</TableHead>
              <TableHead className="table-cell text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="table-row animate-pulse">
                  <TableCell className="table-cell"><div className="h-4 bg-muted rounded w-4 mx-auto"></div></TableCell>
                  <TableCell className="table-cell"><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                  <TableCell className="table-cell"><div className="h-4 bg-muted rounded w-1/2"></div></TableCell>
                  <TableCell className="table-cell"><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                  <TableCell className="table-cell"><div className="h-4 bg-muted rounded w-16"></div></TableCell>
                  <TableCell className="table-cell"><div className="h-4 bg-muted rounded w-24"></div></TableCell>
                  <TableCell className="table-cell"><div className="h-8 bg-muted rounded w-20 ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : (
              filteredCompanies.map(company => (
                <TableRow key={company.id} className="table-row">
                  <TableCell className="table-cell text-center">
                    <input 
                      type="checkbox" 
                      className="bg-muted border-border rounded"
                      checked={selectedCompanies.includes(company.id)}
                      onChange={() => handleSelectOne(company.id)}
                    />
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{company.name}</div>
                        <div className="text-sm text-muted-foreground">{company.contact_person}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="font-mono text-xs text-muted-foreground">{company.registration_number}</div>
                    <div className="font-mono text-xs text-muted-foreground">{company.tax_id}</div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="text-sm text-muted-foreground">{company.email}</div>
                    <div className="text-sm text-muted-foreground">{company.phone}</div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge className={`status-badge ${getStatusColor(company.status)}`}>{company.status}</Badge>
                  </TableCell>
                  <TableCell className="table-cell text-sm text-muted-foreground">
                    {format(new Date(company.created_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="table-cell text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(company)} className="hover:bg-muted">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(company.id)} className="hover:bg-muted text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {filteredCompanies.length === 0 && !isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            No companies found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompany ? "Edit Company" : "Add New Company"}
      >
        <CompanyForm
          company={editingCompany}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        title={`Bulk Edit ${selectedCompanies.length} Companies`}
      >
        <CompanyBulkEditForm
          onSubmit={handleBulkEditSubmit}
          onCancel={() => setIsBulkEditModalOpen(false)}
          selectionCount={selectedCompanies.length}
        />
      </Modal>
    </div>
  );
}