
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Search, Plus, Edit, Eye, UserCheck, Shield, Crown } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UserForm from "@/components/forms/UserForm";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await User.list('-created_date');
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await User.create(userData);
      setIsCreateModalOpen(false);
      await loadUsers(); // Reload the list
    } catch (error) {
      console.error('Error creating user:', error);
      // You could add toast notification here
    }
  };

  const handleEditUser = async (userData) => {
    try {
      await User.update(selectedUser.id, userData);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      await loadUsers(); // Reload the list
    } catch (error) {
      console.error('Error updating user:', error);
      // You could add toast notification here
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return Crown;
      case 'manager': return Shield;
      case 'operator': return UserCheck;
      default: return UserCheck;
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-900/30 text-red-300 border-red-700';
      case 'manager': return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'operator': return 'bg-green-900/30 text-green-300 border-green-700';
      default: return 'bg-background/30 text-muted-foreground border-border';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-900/30 text-green-300 border-green-700'
      : 'bg-red-900/30 text-red-300 border-red-700';
  };

  const getUserInitials = (user) => {
    if (!user) return 'U';
    
    // Safely get values with fallbacks
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const username = user.username || '';
    const email = user.email || '';
    
    // Try to get initials from first and last name
    if (firstName && lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
    
    // Try username
    if (username) {
      return username.charAt(0).toUpperCase();
    }
    
    // Try email
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    
    // Final fallback
    return 'U';
  };

  const filteredUsers = users.filter(user => 
    (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
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
        .users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .users-title {
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
        
        .users-table {
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
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
          font-size: 14px;
        }
        
        .user-details h4 {
          font-weight: 500;
          color: #f8fafc;
          margin: 0;
          font-size: 14px;
        }
        
        .user-details p {
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
      `}</style>

      <div className="users-header">
        <h1 className="users-title">Users</h1>
        <div className="header-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <button className="action-button">
                <Plus size={16} />
                Create User
              </button>
            </DialogTrigger>
            <DialogContent className="modal">
              <DialogHeader>
                <DialogTitle className="text-white">Create New User</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Add a new user to the system with appropriate role and permissions.
                </DialogDescription>
              </DialogHeader>
              <UserForm
                onSubmit={handleCreateUser}
                onCancel={() => setIsCreateModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="users-table">
        <Table>
          <TableHeader className="table-header">
            <TableRow>
              <TableHead className="w-8">
                <input type="checkbox" className="w-4 h-4" />
              </TableHead>
              <TableHead>#</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => {
              const RoleIcon = getRoleIcon(user.role);
              return (
                <TableRow key={user.id} className="table-row">
                  <TableCell className="table-cell">
                    <input type="checkbox" className="w-4 h-4" />
                  </TableCell>
                  <TableCell className="table-cell">
                    <span className="text-muted-foreground font-mono text-sm">{index + 1}</span>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="user-info">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="user-details">
                        <h4>{user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username || user.email || 'Unknown User'}</h4>
                        <p>{user.email || 'No email'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <span className="text-foreground font-medium">{user.username || 'N/A'}</span>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="flex items-center gap-2">
                      <RoleIcon size={14} className="text-muted-foreground" />
                      <Badge className={`status-badge ${getRoleColor(user.role)}`}>
                        {user.role || 'operator'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <span className="text-muted-foreground text-sm">
                      {user.created_date && !isNaN(new Date(user.created_date).getTime()) 
                        ? format(new Date(user.created_date), 'MMM d, yyyy')
                        : 'N/A'
                      }
                    </span>
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge className={`status-badge ${getStatusColor(user.is_active !== false)}`}>
                      {user.is_active !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="action-buttons">
                      <button className="icon-button">
                        <Eye size={14} className="text-muted-foreground" />
                      </button>
                      <button 
                        className="icon-button"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No users found</h3>
            <p className="text-muted-foreground">Invite team members to start collaborating.</p>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="modal">
          <DialogHeader>
            <DialogTitle className="text-white">Edit User</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={selectedUser}
            onSubmit={handleEditUser}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
