import React, { useState, useEffect } from "react";
import { GameMix, Provider } from "@/api/entities";
import { Gamepad2, Factory, ListOrdered, Plus, Edit, Trash2, Search, Download, Eye, Package } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import GameMixForm from "../components/forms/GameMixForm";
import GameMixBulkEditForm from "../components/forms/GameMixBulkEditForm";
import { useNavigate } from "react-router-dom";

export default function GameMixes() {
  const navigate = useNavigate();
  const [gameMixes, setGameMixes] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    provider: '',
    status: '',
    min_games: '',
    max_games: ''
  });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGameMix, setEditingGameMix] = useState(null);
  const [selectedGameMixes, setSelectedGameMixes] = useState([]);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingGameMix, setViewingGameMix] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [gameMixesData, providersData] = await Promise.all([
        GameMix.list('-created_date'),
        Provider.list()
      ]);
      setGameMixes(gameMixesData);
      setProviders(providersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getProviderName = (providerId) => {
    const provider = providers.find(p => p.id === providerId);
    if (provider) return provider.name;
    
    // Fallback: try to find by name if ID doesn't match
    const gameMix = gameMixes.find(gm => gm.provider_id === providerId);
    if (gameMix?.provider_name) {
      return gameMix.provider_name;
    }
    
    return 'Unknown Provider';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'inactive': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'deprecated': return 'bg-red-900/30 text-red-300 border-red-700';
      default: return 'bg-background/30 text-muted-foreground border-border';
    }
  };

  // Event handlers
  const handleAdd = () => {
    setEditingGameMix(null);
    setIsModalOpen(true);
  };

  const handleEdit = (mix) => {
    setEditingGameMix(mix);
    setIsModalOpen(true);
  };

  const handleView = (mix) => {
    navigate(`/game-mix-detail?id=${mix.id}`);
  };

  const handleDelete = async (mixId) => {
    if (window.confirm('Are you sure you want to delete this game mix?')) {
      try {
        await GameMix.delete(mixId);
        await loadData();
        setSelectedGameMixes(prev => prev.filter(id => id !== mixId));
      } catch (error) {
        console.error('Error deleting game mix:', error);
        alert('Failed to delete game mix.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingGameMix) {
        await GameMix.update(editingGameMix.id, formData);
      } else {
        await GameMix.create(formData);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving game mix:', error);
      alert('Failed to save game mix.');
    }
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedGameMixes(filteredGameMixes.map(mix => mix.id));
    } else {
      setSelectedGameMixes([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedGameMixes(prev => 
      prev.includes(id) ? prev.filter(mixId => mixId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedGameMixes.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedGameMixes.length} game mixes?`)) {
      try {
        setIsLoading(true);
        await Promise.all(selectedGameMixes.map(id => GameMix.delete(id)));
        await loadData();
        setSelectedGameMixes([]);
      } catch (error) {
        console.error('Error bulk deleting game mixes:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBulkEditSubmit = async (formData) => {
    const updates = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null) acc[key] = value;
      return acc;
    }, {});

    if (Object.keys(updates).length === 0) {
      setIsBulkEditModalOpen(false);
      return;
    }

    try {
      setIsLoading(true);
      await Promise.all(selectedGameMixes.map(id => GameMix.update(id, updates)));
      await loadData();
      setIsBulkEditModalOpen(false);
      setSelectedGameMixes([]);
    } catch (error) {
      console.error('Error bulk editing game mixes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Provider', 'Game Count', 'Status', 'Description', 'Created Date'].join(','),
      ...filteredGameMixes.map(mix => [
        mix.name,
        getProviderName(mix.provider_id),
        mix.game_count,
        mix.status,
        mix.description?.replace(/,/g, ';') || '',
        format(new Date(mix.created_date), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `game_mixes_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  // Filter game mixes
  const filteredGameMixes = gameMixes.filter(mix => {
    const matchesSearch = (mix.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mix.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getProviderName(mix.provider_id).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProvider = !filters.provider || mix.provider_id === filters.provider;
    const matchesStatus = !filters.status || mix.status === filters.status;
    
    let matchesGameCount = true;
    if (filters.min_games && mix.game_count < parseInt(filters.min_games)) matchesGameCount = false;
    if (filters.max_games && mix.game_count > parseInt(filters.max_games)) matchesGameCount = false;

    return matchesSearch && matchesProvider && matchesStatus && matchesGameCount;
  });

  const statistics = {
    total: gameMixes.length,
    active: gameMixes.filter(mix => mix.status === 'active').length,
    inactive: gameMixes.filter(mix => mix.status === 'inactive').length,
    deprecated: gameMixes.filter(mix => mix.status === 'deprecated').length,
    totalGames: gameMixes.reduce((sum, mix) => sum + (mix.game_count || 0), 0),
    avgGames: gameMixes.length > 0 ? 
      Math.round(gameMixes.reduce((sum, mix) => sum + (mix.game_count || 0), 0) / gameMixes.length) : 0
  };

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Game Mixes</h1>
            <p className="text-muted-foreground">Manage game collections and configurations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleExport} variant="outline" className="border-border bg-card hover:bg-muted">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Game Mix
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">{statistics.total}</div>
            <div className="text-sm text-muted-foreground">Total Mixes</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-green-400">{statistics.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-yellow-400">{statistics.inactive}</div>
            <div className="text-sm text-muted-foreground">Inactive</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-red-400">{statistics.deprecated}</div>
            <div className="text-sm text-muted-foreground">Deprecated</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-blue-400">{statistics.totalGames}</div>
            <div className="text-sm text-muted-foreground">Total Games</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-purple-400">{statistics.avgGames}</div>
            <div className="text-sm text-muted-foreground">Avg per Mix</div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search mixes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border-border pl-10"
            />
          </div>
          <Select value={filters.provider} onValueChange={(value) => setFilters(prev => ({...prev, provider: value}))}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue placeholder="All Providers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Providers</SelectItem>
              {providers.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              placeholder="Min games"
              type="number"
              value={filters.min_games}
              onChange={(e) => setFilters(prev => ({...prev, min_games: e.target.value}))}
              className="bg-card border-border"
            />
            <Input
              placeholder="Max games"
              type="number"
              value={filters.max_games}
              onChange={(e) => setFilters(prev => ({...prev, max_games: e.target.value}))}
              className="bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsBulkEditModalOpen(true)}
              disabled={selectedGameMixes.length === 0}
              variant="outline"
              className="border-border bg-card hover:bg-muted"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit ({selectedGameMixes.length})
            </Button>
            <Button 
              onClick={handleBulkDelete}
              disabled={selectedGameMixes.length === 0}
              variant="destructive"
              className="bg-red-800/80 hover:bg-red-800"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedGameMixes.length})
            </Button>
          </div>
        </div>
      </header>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-row">
              <TableHead className="w-12 text-center">
                <input 
                  type="checkbox" 
                  className="bg-muted border-border rounded"
                  onChange={handleSelectAll}
                  checked={filteredGameMixes.length > 0 && selectedGameMixes.length === filteredGameMixes.length}
                  ref={input => {
                    if (input) input.indeterminate = selectedGameMixes.length > 0 && selectedGameMixes.length < filteredGameMixes.length;
                  }}
                />
              </TableHead>
              <TableHead className="text-muted-foreground">Game Mix Info</TableHead>
              <TableHead className="text-muted-foreground">Provider</TableHead>
              <TableHead className="text-muted-foreground">Game Details</TableHead>
              <TableHead className="text-muted-foreground">Games List</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Created</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell><div className="h-4 bg-muted rounded w-4 mx-auto"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-1/2"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-16"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-16"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-20"></div></TableCell>
                  <TableCell><div className="h-8 bg-muted rounded w-20 ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : (
              filteredGameMixes.map(mix => (
                <TableRow key={mix.id} className="border-border hover:bg-accent">
                  <TableCell className="text-center">
                    <input 
                      type="checkbox" 
                      className="bg-muted border-border rounded"
                      checked={selectedGameMixes.includes(mix.id)}
                      onChange={() => handleSelectOne(mix.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center">
                        <Gamepad2 className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{mix.name}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">{mix.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Factory className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{getProviderName(mix.provider_id)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">{mix.game_count}</span>
                      <span className="text-muted-foreground text-sm">games</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {mix.games && Array.isArray(mix.games) && mix.games.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {mix.games.slice(0, 3).map((game, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-muted text-muted-foreground border-border">
                              {game}
                            </Badge>
                          ))}
                          {mix.games.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border">
                              +{mix.games.length - 3} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No games listed</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(mix.status)}>{mix.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {mix.created_date ? 
                        format(new Date(mix.created_date), 'MMM d, yyyy') : 
                        'N/A'
                      }
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(mix)} className="hover:bg-muted">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(mix)} className="hover:bg-muted">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(mix.id)} className="hover:bg-muted text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {filteredGameMixes.length === 0 && !isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No game mixes found</h3>
            <p className="text-muted-foreground">Create your first game mix to get started.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGameMix ? "Edit Game Mix" : "Add New Game Mix"}
      >
        <GameMixForm
          gameMix={editingGameMix}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        title={`Bulk Edit ${selectedGameMixes.length} Game Mixes`}
      >
        <GameMixBulkEditForm
          onSubmit={handleBulkEditSubmit}
          onCancel={() => setIsBulkEditModalOpen(false)}
          selectionCount={selectedGameMixes.length}
        />
      </Modal>

      {/* View Game Mix Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`View Game Mix: ${viewingGameMix?.name || ''}`}
      >
        {viewingGameMix && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Name</label>
                <p className="text-white">{viewingGameMix.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Provider</label>
                <p className="text-white">{getProviderName(viewingGameMix.provider_id)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Status</label>
                <Badge className={getStatusColor(viewingGameMix.status)}>
                  {viewingGameMix.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Game Count</label>
                <p className="text-white">{viewingGameMix.games?.length || 0}</p>
              </div>
            </div>
            
            {viewingGameMix.games && viewingGameMix.games.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Games</label>
                <div className="bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-2">
                    {viewingGameMix.games.map((game, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <span className="text-white">{game}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsViewModalOpen(false);
                handleEdit(viewingGameMix);
              }}>
                Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}