
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, Building2, MapPin, Factory, Monitor, 
  Gamepad2, Coins, FileText, FlaskConical, Trophy, 
  Users, Moon, User as UserIcon, Settings, LogOut, BarChart3,
  ChevronRight, ChevronDown, Laptop, FileCheck, Building
} from "lucide-react";
import { Company, User } from "@/api/entities";
import { Location } from "@/api/entities";
import { Provider } from "@/api/entities";
import { Cabinet } from "@/api/entities";
import { GameMix } from "@/api/entities";
import { Platform } from "@/api/entities";
import { SlotMachine } from "@/api/entities";
import { Invoice } from "@/api/entities";
import { Metrology, MetrologyApproval, MetrologyCommission, MetrologyAuthority, MetrologySoftware } from "@/api/entities";
import { Jackpot } from "@/api/entities";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser] = useState({
    first_name: "Administrator",
    last_name: "Sistem",
    email: "admin@cashpot.ro",
    role: "Admin",
    avatar: null // Will be set when user uploads an avatar
  });

  const [counts, setCounts] = useState({
    companies: 0,
    locations: 0,
    providers: 0,
    cabinets: 0,
    gameMixes: 0,
    platforms: 0,
    slots: 0,
    warehouse: 0,
    metrology: 0,
    metrologyApprovals: 0,
    metrologyCommissions: 0,
    metrologyAuthorities: 0,
    metrologySoftware: 0,
    jackpots: 0,
    invoices: 0,
    users: 0,
  });

  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        console.log('Fetching counts for dashboard...');
        
        const [
          companies, locations, providers, cabinets, gameMixes, platforms,
          slotMachines, invoices, metrology, metrologyApprovals, metrologyCommissions, metrologyAuthorities, metrologySoftware, jackpots, users
        ] = await Promise.all([
          Company.list(), Location.list(), Provider.list(), Cabinet.list(),
          GameMix.list(), Platform.list(), SlotMachine.list(), Invoice.list(), Metrology.list(),
          MetrologyApproval.list(), MetrologyCommission.list(), MetrologyAuthority.list(), MetrologySoftware.list(),
          Jackpot.list(), User.list()
        ]);
        
        console.log('Fetched data:', {
          companies: companies.length,
          locations: locations.length,
          providers: providers.length,
          cabinets: cabinets.length,
          gameMixes: gameMixes.length,
          platforms: platforms.length,
          slotMachines: slotMachines.length,
          invoices: invoices.length,
          metrology: metrology.length,
          metrologyApprovals: metrologyApprovals.length,
          metrologyCommissions: metrologyCommissions.length,
          metrologyAuthorities: metrologyAuthorities.length,
          metrologySoftware: metrologySoftware.length,
          jackpots: jackpots.length,
          users: users.length
        });
        
        const warehouseCount = slotMachines.filter(m => m.status === 'storage' || !m.location_id).length;

        const newCounts = {
          companies: companies.length,
          locations: locations.length,
          providers: providers.length,
          cabinets: cabinets.length,
          gameMixes: gameMixes.length,
          platforms: platforms.length,
          slots: slotMachines.length,
          warehouse: warehouseCount,
          metrology: metrology.length,
          metrologyApprovals: metrologyApprovals.length,
          metrologyCommissions: metrologyCommissions.length,
          metrologyAuthorities: metrologyAuthorities.length,
          metrologySoftware: metrologySoftware.length,
          jackpots: jackpots.length,
          invoices: invoices.length,
          users: users.length,
        };
        
        console.log('Setting counts:', newCounts);
        setCounts(newCounts);

      } catch (error) {
        console.error("Failed to fetch sidebar counts:", error);
      }
    };

    fetchCounts();
  }, []);

  // Auto-expand menu if current page is in submenu
  useEffect(() => {
    const currentPath = location.pathname;
    navigationItems.forEach(item => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some(subItem => subItem.url === currentPath);
        if (hasActiveSubmenu) {
          setExpandedMenus(prev => ({
            ...prev,
            [item.title]: true
          }));
        }
      }
    });
  }, [location.pathname]);
  
  const navigationItems = [
    { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard, count: null },
    { title: "Companies", url: createPageUrl("Companies"), icon: Building2, count: counts.companies },
    { title: "Locations", url: createPageUrl("Locations"), icon: MapPin, count: counts.locations },
    { title: "Providers", url: createPageUrl("Providers"), icon: Factory, count: counts.providers },
    { title: "Cabinets", url: createPageUrl("Cabinets"), icon: Monitor, count: counts.cabinets },
    { 
      title: "Game Mixes", 
      url: createPageUrl("GameMixes"), 
      icon: Gamepad2, 
      count: counts.gameMixes,
      submenu: [
        { title: "Platforms", url: createPageUrl("Platforms"), icon: Laptop, count: counts.platforms }
      ]
    },
    { title: "Slots", url: createPageUrl("SlotMachines"), icon: Coins, count: counts.slots },
    { title: "Warehouse", url: createPageUrl("Warehouse"), icon: Building2, count: counts.warehouse },
    { 
      title: "Metrology", 
      url: createPageUrl("Metrology"), 
      icon: FlaskConical, 
      count: counts.metrology,
      submenu: [
        { title: "Aprobări de tip", url: createPageUrl("MetrologyApprovals"), icon: FileCheck, count: counts.metrologyApprovals },
        { title: "Comisii", url: createPageUrl("MetrologyCommissions"), icon: Users, count: counts.metrologyCommissions },
        { title: "Autorități Metrologice", url: createPageUrl("MetrologyAuthorities"), icon: Building, count: counts.metrologyAuthorities },
        { title: "Software", url: createPageUrl("MetrologySoftware"), icon: Laptop, count: counts.metrologySoftware }
      ]
    },
    { title: "Jackpots", url: createPageUrl("Jackpots"), icon: Trophy, count: counts.jackpots },
    { title: "Invoices", url: createPageUrl("Invoices"), icon: FileText, count: counts.invoices },
    { title: "ONJN Reports", url: createPageUrl("ONJNReports"), icon: BarChart3, count: 0 },
    { title: "Legal Documents", url: createPageUrl("LegalDocuments"), icon: FileText, count: 3 },
    { title: "Users", url: createPageUrl("Users"), icon: Users, count: counts.users }
  ];

  const toggleMenu = (menuTitle) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuTitle]: !prev[menuTitle]
    }));
  };

  const getUserInitials = () => {
    if (!currentUser) return "A";
    
    const firstName = currentUser.first_name || "";
    const lastName = currentUser.last_name || "";
    const username = currentUser.username || "";
    const email = currentUser.email || "";
    
    // Try to get initials from first and last name
    if (firstName && lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
    
    // If no first/last name, try username
    if (username) {
      return username.charAt(0).toUpperCase();
    }
    
    // If no username, try email
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    
    // Default fallback
    return "A";
  };

  return (
    <div className="min-h-screen flex flex-row w-full bg-background">
      <style>{`
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          margin-bottom: 2px;
          color: hsl(var(--sidebar-foreground));
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }
        
        .nav-item:hover {
          background: hsl(var(--sidebar-accent));
          color: hsl(var(--sidebar-accent-foreground));
        }
        
        .nav-item.active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        
        .count-badge {
          background: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          margin-left: auto;
        }
      `}</style>

      {/* Sidebar */}
      <div className="w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col sidebar">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <div>
              <h2 className="font-bold text-lg text-sidebar-primary">CASHPOT</h2>
              <p className="text-xs text-sidebar-foreground/70">Gaming Management System</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            const isExpanded = expandedMenus[item.title];
            const navClasses = `nav-item ${isActive ? 'active' : ''}`;
            
            return (
              <div key={item.title}>
                {item.submenu ? (
                  <div>
                    <div className="flex items-center">
                      <Link to={item.url} className={`${navClasses} nav-item flex-1`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        {item.count !== null && (
                          <span className="count-badge">{item.count}</span>
                        )}
                      </Link>
                      <button 
                        onClick={() => toggleMenu(item.title)}
                        className="p-2 hover:bg-sidebar-accent rounded"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* Expandable Submenu */}
                    {isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subItem) => {
                          const isSubActive = location.pathname === subItem.url;
                          const subNavClasses = `nav-item ${isSubActive ? 'active' : ''} text-sm`;
                          
                          return (
                            <Link key={subItem.title} to={subItem.url} className={`${subNavClasses} nav-item`}>
                              <subItem.icon className="w-3 h-3" />
                              <span>{subItem.title}</span>
                              {subItem.count !== null && (
                                <span className="count-badge">{subItem.count}</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to={item.url} className={`${navClasses} nav-item`}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                    {item.count !== null && (
                      <span className="count-badge">{item.count}</span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 main-content">
        {/* Top Bar */}
        <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🏦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CASHPOT V7</h1>
              <p className="text-xs text-muted-foreground">Gaming Management System</p>
              <p className="text-xs text-muted-foreground">v7.0.0 - {new Date().toLocaleString('ro-RO', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit'
              })}</p>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 text-foreground hover:text-primary">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser?.avatar} alt={`${currentUser?.first_name} ${currentUser?.last_name}`} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">
                      {currentUser?.first_name && currentUser?.last_name 
                        ? `${currentUser.first_name} ${currentUser.last_name}`
                        : currentUser?.username || currentUser?.email || "Administrator"
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">{currentUser?.role || "Admin"}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
