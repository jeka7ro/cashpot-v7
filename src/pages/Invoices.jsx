import React, { useState, useEffect } from "react";
import { Invoice, Company, Location } from "@/api/entities";
import { Search, Plus, Edit, Download, Upload, FileText, Calendar, DollarSign, Clock, Trash2, Paperclip, Eye } from "lucide-react";
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
import InvoiceForm from "../components/forms/InvoiceForm";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [invoicesData, companiesData, locationsData] = await Promise.all([
        Invoice.list('-created_date'),
        Company.list(),
        Location.list()
      ]);
      setInvoices(invoicesData);
      setCompanies(companiesData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Error loading invoices data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };

  const getLocationName = (locationId) => {
    const location = locations.find(l => l.id === locationId);
    return location?.name || 'Unknown Location';
  };

  // Handler functions
  const handleAdd = () => {
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await Invoice.delete(invoiceId);
        await loadData();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const handleSelectOne = (invoiceId) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
    }
  };

  const handleModalSubmit = async (invoiceData) => {
    try {
      if (editingInvoice) {
        await Invoice.update(editingInvoice.id, invoiceData);
      } else {
        await Invoice.create(invoiceData);
      }
      await loadData();
      setIsModalOpen(false);
      setEditingInvoice(null);
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingInvoice(null);
  };

  const handleViewInvoice = (invoice) => {
    // Create a detailed view of the invoice
    const invoiceDetails = `
INVOICE DETAILS
================

Invoice Number: ${invoice.invoice_number || 'N/A'}
Serial Number: ${invoice.serial_number || 'N/A'}
Company: ${getCompanyName(invoice.company_id)}
Location: ${getLocationName(invoice.location_id)}
Amount: ${invoice.currency === 'RON' ? 'RON ' : invoice.currency === 'USD' ? '$' : '€'}${invoice.amount?.toLocaleString('ro-RO') || '0'}
Issue Date: ${invoice.issue_date ? format(new Date(invoice.issue_date), 'MMM dd, yyyy') : 'N/A'}
Due Date: ${invoice.due_date ? format(new Date(invoice.due_date), 'MMM dd, yyyy') : 'N/A'}
Status: ${invoice.status || 'N/A'}
Description: ${invoice.description || 'N/A'}

Attachments: ${invoice.attachments?.length || 0} file(s)
${invoice.attachments?.map(att => `- ${att.name}`).join('\n') || 'No attachments'}

Created: ${invoice.created_date ? format(new Date(invoice.created_date), 'MMM dd, yyyy HH:mm') : 'N/A'}
Updated: ${invoice.updated_date ? format(new Date(invoice.updated_date), 'MMM dd, yyyy HH:mm') : 'N/A'}
    `.trim();

    // Show in a new window
    const newWindow = window.open('', '_blank', 'width=600,height=400');
    newWindow.document.write(`
      <html>
        <head><title>Invoice ${invoice.invoice_number || invoice.id}</title></head>
        <body style="font-family: monospace; padding: 20px; background: #f5f5f5;">
          <pre style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${invoiceDetails}</pre>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  const handlePreviewAttachment = (invoice) => {
    if (!invoice.attachments || invoice.attachments.length === 0) {
      alert('No attachments available for this invoice.');
      return;
    }

    // If multiple attachments, show the first one
    const attachment = invoice.attachments[0];
    const fileUrl = attachment.url || attachment.data || attachment.path;

    if (!fileUrl) {
      alert('Attachment file not found.');
      return;
    }

    console.log('Previewing attachment:', {
      name: attachment.name,
      type: attachment.type,
      url: fileUrl,
      isBase64: fileUrl.startsWith('data:'),
      isExternal: fileUrl.startsWith('http')
    });

    // Check if it's a base64 data URL
    if (fileUrl.startsWith('data:')) {
      // Open base64 data in new window
      const newWindow = window.open(fileUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (!newWindow) {
        // If popup blocked, try to download instead
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = attachment.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (fileUrl.startsWith('http')) {
      // Handle external URLs - open directly
      const newWindow = window.open(fileUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (!newWindow) {
        // If popup blocked, try to download instead
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = attachment.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      // Handle local file paths
      const newWindow = window.open(fileUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (!newWindow) {
        // If popup blocked, try to download instead
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = attachment.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleDownloadInvoice = (invoice) => {
    // If there are attachments, download the first one
    if (invoice.attachments && invoice.attachments.length > 0) {
      const attachment = invoice.attachments[0];
      const fileUrl = attachment.url || attachment.data || attachment.path;
      
      if (fileUrl) {
        console.log('Downloading attachment:', {
          name: attachment.name,
          type: attachment.type,
          url: fileUrl,
          isBase64: fileUrl.startsWith('data:'),
          isExternal: fileUrl.startsWith('http')
        });

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = attachment.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
    }
    
    // Fallback: Create a simple text representation of the invoice
    const invoiceText = `
INVOICE #${invoice.invoice_number}
Serial #: ${invoice.serial_number || 'N/A'}
Company: ${getCompanyName(invoice.company_id)}
Location: ${getLocationName(invoice.location_id)}
Amount: ${invoice.currency === 'RON' ? 'RON ' : invoice.currency === 'USD' ? '$' : '€'}${invoice.amount?.toLocaleString('ro-RO') || '0'}
Issue Date: ${invoice.issue_date ? format(new Date(invoice.issue_date), 'MMM dd, yyyy') : 'N/A'}
Due Date: ${invoice.due_date ? format(new Date(invoice.due_date), 'MMM dd, yyyy') : 'N/A'}
Status: ${invoice.status || 'N/A'}
Description: ${invoice.description || 'N/A'}
    `.trim();

    // Create and download the file
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoice.invoice_number || invoice.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'pending': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'overdue': return 'bg-red-900/30 text-red-300 border-red-700';
      case 'cancelled': return 'bg-gray-900/30 text-gray-300 border-gray-700';
      default: return 'bg-blue-900/30 text-blue-300 border-blue-700';
    }
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCompanyName(invoice.company_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getLocationName(invoice.location_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-card rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
        
        <div className="flex gap-3 items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              type="text"
              placeholder="Search invoices..."
              className="pl-10 bg-input border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Invoice
          </Button>
          
          <Button variant="outline" className="border-border bg-card hover:bg-muted">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" className="border-border bg-card hover:bg-muted">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-12 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-blue-600"
                  checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-8">#</TableHead>
              <TableHead>INVOICE #</TableHead>
              <TableHead>SERIAL #</TableHead>
              <TableHead>COMPANY</TableHead>
              <TableHead>LOCATION</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>ISSUE DATE</TableHead>
              <TableHead>DUE DATE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ATTACHMENTS</TableHead>
              <TableHead className="text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <FileText className="w-12 h-12 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-lg">No invoices found</p>
                      <p className="text-muted-foreground text-sm">Create your first invoice to get started</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice, index) => (
                <TableRow key={invoice.id} className="hover:bg-muted/50">
                  <TableCell className="text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-blue-600"
                      checked={selectedInvoices.includes(invoice.id)}
                      onChange={() => handleSelectOne(invoice.id)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-mono font-semibold">
                    {invoice.invoice_number || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-mono">
                      {invoice.serial_number || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCompanyName(invoice.company_id)}
                  </TableCell>
                  <TableCell>
                    {getLocationName(invoice.location_id)}
                  </TableCell>
                  <TableCell className="font-bold text-lg">
                    {invoice.currency === 'RON' ? 'RON ' : invoice.currency === 'USD' ? '$' : '€'}{invoice.amount?.toLocaleString('ro-RO') || '0'}
                  </TableCell>
                  <TableCell>
                    {invoice.issue_date ? format(new Date(invoice.issue_date), 'MMM dd, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {invoice.due_date ? format(new Date(invoice.due_date), 'MMM dd, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {invoice.attachments && invoice.attachments.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Paperclip className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {invoice.attachments.length} file{invoice.attachments.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            title="Preview Attachment"
                            onClick={() => handlePreviewAttachment(invoice)}
                          >
                            <Eye className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No files</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        title="View Invoice Details"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        title="Edit"
                        onClick={() => handleEdit(invoice)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        title="Download Invoice"
                        onClick={() => handleDownloadInvoice(invoice)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Delete"
                        onClick={() => handleDelete(invoice.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        title={editingInvoice ? 'Edit Invoice' : 'Add Invoice'}
      >
        <InvoiceForm
          invoice={editingInvoice}
          companies={companies}
          locations={locations}
          onSubmit={handleModalSubmit}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}