import React, { useState, useEffect } from "react";
import { 
  Company, Location, Provider, Cabinet, GameMix, 
  SlotMachine, Invoice, Metrology, Jackpot, User 
} from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, MapPin, Factory, Monitor, Gamepad2, 
  Coins, FileText, FlaskConical, Trophy, Users,
  AlertTriangle, TrendingUp, Activity, Calendar
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";

import StatsCard from "../components/common/StatsCard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    companies: 0,
    locations: 0,
    providers: 0,
    slotMachines: 0,
    activeInvoices: 0,
    totalRevenue: 0,
    expiringCerts: 0,
    activeJackpots: 0
  });
  
  const [recentData, setRecentData] = useState({
    machines: [],
    invoices: [],
    certificates: [],
    jackpots: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const [
        companies, locations, providers, 
        slotMachines, invoices, metrology, jackpots
      ] = await Promise.all([
        Company.list(),
        Location.list(),
        Provider.list(),
        SlotMachine.list('-created_date', 10),
        Invoice.list('-created_date', 10),
        Metrology.list(),
        Jackpot.list()
      ]);

      const expiringCerts = metrology.filter(cert => {
        if (!cert.expiry_date && !cert.cvt_date) return false;
        
        const expiryDate = cert.expiry_date ? 
          new Date(cert.expiry_date) : 
          new Date(new Date(cert.cvt_date).setFullYear(new Date(cert.cvt_date).getFullYear() + 1));
        
        const daysLeft = differenceInDays(expiryDate, new Date());
        return daysLeft <= 90 && daysLeft >= 0;
      });

      const activeInvoices = invoices.filter(inv => inv.status === 'pending').length;
      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.amount || 0), 0);
      
      const activeJackpots = jackpots.filter(jp => jp.status === 'active').length;

      setStats({
        companies: companies.length,
        locations: locations.length,
        providers: providers.length,
        slotMachines: slotMachines.length,
        activeInvoices,
        totalRevenue,
        expiringCerts: expiringCerts.length,
        activeJackpots
      });

      setRecentData({
        machines: slotMachines.slice(0, 5),
        invoices: invoices.slice(0, 5),
        certificates: expiringCerts.slice(0, 5),
        jackpots: jackpots.filter(jp => jp.status === 'active').slice(0, 5)
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Companies",
      value: stats.companies,
      subtitle: "Registered companies",
      icon: Building2,
      color: "blue",
      delay: 0
    },
    {
      title: "Active Locations", 
      value: stats.locations,
      subtitle: "Gaming locations",
      icon: MapPin,
      color: "green",
      delay: 0.1
    },
    {
      title: "Slot Machines",
      value: stats.slotMachines,
      subtitle: "Total machines",
      icon: Coins,
      color: "yellow",
      delay: 0.2
    },
    {
      title: "Pending Invoices",
      value: stats.activeInvoices,
      subtitle: "Awaiting payment",
      icon: FileText,
      color: "red",
      delay: 0.3
    },
    {
      title: "Total Revenue",
      value: `€${stats.totalRevenue.toLocaleString()}`,
      subtitle: "Paid invoices",
      icon: TrendingUp,
      color: "green",
      trend: "+12%",
      trendDirection: "up",
      delay: 0.4
    },
    {
      title: "Expiring Certificates",
      value: stats.expiringCerts,
      subtitle: "Next 90 days",
      icon: AlertTriangle,
      color: stats.expiringCerts > 0 ? "red" : "green",
      delay: 0.5
    },
    {
      title: "Active Jackpots",
      value: stats.activeJackpots,
      subtitle: "Running jackpots",
      icon: Trophy,
      color: "purple",
      delay: 0.6
    },
    {
      title: "System Health",
      value: "Online",
      subtitle: "All systems operational",
      icon: Activity,
      color: "green",
      delay: 0.7
    }
  ];

  if (isLoading) {
    return (
      <div className="p-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2 animate-pulse">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-4 bg-muted rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-card rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold text-foreground">
            Gaming Management Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time monitoring and analytics for your casino operations
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Last updated: {format(new Date(), 'PPpp')}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card) => (
            <StatsCard key={card.title} {...card} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Slot Machines */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm stats-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Coins className="w-5 h-5" />
                  Recent Slot Machines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentData.machines.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No slot machines registered yet
                    </p>
                  ) : (
                    recentData.machines.map((machine) => (
                      <div key={machine.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-foreground">
                            {machine.serial_number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {machine.model} - RTP: {machine.rtp}%
                          </p>
                        </div>
                        <Badge className={`${
                          machine.status === 'active' 
                            ? 'bg-green-900/30 text-green-300'
                            : 'bg-card text-muted-foreground'
                        }`}>
                          {machine.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expiring Certificates */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm stats-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FlaskConical className="w-5 h-5" />
                  Expiring Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentData.certificates.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No expiring certificates
                    </p>
                  ) : (
                    recentData.certificates.map((cert) => {
                      const expiryDate = cert.expiry_date ? 
                        new Date(cert.expiry_date) : 
                        new Date(new Date(cert.cvt_date).setFullYear(new Date(cert.cvt_date).getFullYear() + 1));
                      
                      const daysLeft = differenceInDays(expiryDate, new Date());
                      
                      return (
                        <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium text-foreground">
                              {cert.serial_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {cert.certificate_number}
                            </p>
                          </div>
                          <Badge className={`${
                            daysLeft <= 30 
                              ? 'bg-red-900/30 text-red-300'
                              : daysLeft <= 90
                              ? 'bg-yellow-900/30 text-yellow-300'
                              : 'bg-green-900/30 text-green-300'
                          }`}>
                            {daysLeft} days
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col gap-2 bg-muted hover:bg-accent border-border btn-primary"
                  >
                  <Building2 className="w-5 h-5" />
                  Add Company
                </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col gap-2 bg-muted hover:bg-accent border-border btn-primary"
                  >
                  <Coins className="w-5 h-5" />
                  Add Machine
                </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col gap-2 bg-muted hover:bg-accent border-border btn-primary"
                  >
                  <FileText className="w-5 h-5" />
                  New Invoice
                </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col gap-2 bg-muted hover:bg-accent border-border btn-primary"
                  >
                  <FlaskConical className="w-5 h-5" />
                  Add Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}