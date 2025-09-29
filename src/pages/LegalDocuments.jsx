
import React, { useState } from "react";
import { Search, Upload, Download, FileText, Plus, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LegalDocuments() {
  const [documents] = useState([
    {
      id: 1,
      name: "Gaming License 2024",
      type: "license",
      category: "regulatory",
      uploadDate: "2024-01-15",
      expiryDate: "2024-12-31",
      size: "2.3 MB",
      status: "active"
    },
    {
      id: 2,
      name: "Fire Safety Certificate",
      type: "certificate",
      category: "safety",
      uploadDate: "2024-02-01",
      expiryDate: "2025-01-31",
      size: "1.8 MB",
      status: "active"
    },
    {
      id: 3,
      name: "Insurance Policy",
      type: "insurance",
      category: "financial",
      uploadDate: "2024-01-10",
      expiryDate: "2024-12-31",
      size: "4.2 MB",
      status: "expiring"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'expiring': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'expired': return 'bg-red-900/30 text-red-300 border-red-700';
      default: return 'bg-background/30 text-muted-foreground border-border';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'regulatory': return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'safety': return 'bg-orange-900/30 text-orange-300 border-orange-700';
      case 'financial': return 'bg-purple-900/30 text-purple-300 border-purple-700';
      default: return 'bg-background/30 text-muted-foreground border-border';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    (doc.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Legal Documents</h1>
          <p className="text-muted-foreground">Manage licenses, certificates, and legal documentation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border hover:bg-muted">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Document
          </Button>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card border-border pl-9"
          />
        </div>
        <Button variant="outline" className="border-border hover:bg-muted">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{documents.length}</div>
            <p className="text-xs text-muted-foreground">All categories</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Documents</CardTitle>
            <FileText className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {documents.filter(d => d.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently valid</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
            <FileText className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {documents.filter(d => d.status === 'expiring').length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8.3 MB</div>
            <p className="text-xs text-muted-foreground">Total file size</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="w-5 h-5" />
            Document Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No documents match your search criteria
              </p>
            ) : (
              filteredDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{doc.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getCategoryColor(doc.category)}>
                          {doc.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{doc.type}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Expires: {format(new Date(doc.expiryDate), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {format(new Date(doc.uploadDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-accent">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-accent">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-accent text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
