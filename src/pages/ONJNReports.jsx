
import React, { useState, useEffect } from "react";
import { SlotMachine, Location, Company, Provider } from "@/api/entities";
import { BarChart3, Download, FileText, Calendar, Building2 } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ONJNReports() {
  const [reportData, setReportData] = useState({
    totalMachines: 0,
    activeMachines: 0,
    machinesByLocation: [],
    machinesByProvider: [],
    rentedMachines: 0,
    ownedMachines: 0
  });
  
  const [filters, setFilters] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    companyId: '',
    locationId: '',
    reportType: 'monthly'
  });

  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadData = async () => {
    try {
      // This function is primarily to load data for filter dropdowns.
      const [companiesData, locationsData] = await Promise.all([
        Company.list(),
        Location.list()
      ]);
      setCompanies(companiesData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Error loading initial data for filters:', error);
    }
  };

  const generateReport = async () => {
    try {
      setIsGenerating(true);
      // Fetch all necessary data for report generation directly within this function
      // to ensure data consistency and avoid relying on potentially stale state.
      const [machines, fetchedLocations, fetchedProviders, fetchedCompanies] = await Promise.all([
        SlotMachine.list(),
        Location.list(),
        Provider.list(),
        Company.list() // Fetch companies here as well
      ]);

      // Filter machines based on filters
      let filteredMachines = machines;
      
      if (filters.companyId) {
        // Use fetchedLocations for filtering if companyId is present
        const companyLocations = fetchedLocations.filter(l => l.company_id === filters.companyId);
        const companyLocationIds = companyLocations.map(l => l.id);
        filteredMachines = machines.filter(m => 
          companyLocationIds.includes(m.location_id) || !m.location_id
        );
      }

      if (filters.locationId) {
        filteredMachines = machines.filter(m => m.location_id === filters.locationId);
      }

      // Calculate statistics
      const totalMachines = filteredMachines.length;
      const activeMachines = filteredMachines.filter(m => m.status === 'active').length;
      const rentedMachines = filteredMachines.filter(m => m.ownership_type === 'rent').length;
      const ownedMachines = filteredMachines.filter(m => m.ownership_type === 'property').length;

      // Group by location
      // Use fetchedLocations for grouping
      const machinesByLocation = fetchedLocations.map(location => {
        const machinesAtLocation = filteredMachines.filter(m => m.location_id === location.id);
        return {
          locationName: location.name,
          city: location.city,
          county: location.county,
          totalMachines: machinesAtLocation.length,
          activeMachines: machinesAtLocation.filter(m => m.status === 'active').length,
          // Use fetchedCompanies for company name
          company: fetchedCompanies.find(c => c.id === location.company_id)?.name || 'N/A'
        };
      }).filter(l => l.totalMachines > 0);

      // Group by provider
      const providerGroups = {};
      filteredMachines.forEach(machine => {
        // Use fetchedProviders for provider lookup
        const provider = fetchedProviders.find(p => p.id === machine.provider_id);
        const providerName = provider?.name || 'Unknown';
        if (!providerGroups[providerName]) {
          providerGroups[providerName] = { total: 0, active: 0, rented: 0, owned: 0 };
        }
        providerGroups[providerName].total++;
        if (machine.status === 'active') providerGroups[providerName].active++;
        if (machine.ownership_type === 'rent') providerGroups[providerName].rented++;
        if (machine.ownership_type === 'property') providerGroups[providerName].owned++;
      });

      const machinesByProvider = Object.entries(providerGroups).map(([name, data]) => ({
        providerName: name,
        ...data
      }));

      setReportData({
        totalMachines,
        activeMachines,
        machinesByLocation,
        machinesByProvider,
        rentedMachines,
        ownedMachines
      });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Load data for filter dropdowns.
    loadData(); 
    // Generate the initial report.
    // The generateReport function now fetches all data it needs internally,
    // so it doesn't depend on the 'companies' or 'locations' state from loadData
    // being immediately available in the same render cycle.
    generateReport();
  }, []); // Empty dependency array - only run once on mount

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const exportReport = () => {
    const reportContent = `
RAPORT ONJN - ${format(new Date(), 'dd/MM/yyyy')}
==========================================

PERIOADA: ${filters.startDate} - ${filters.endDate}

REZUMAT GENERAL:
- Total mașini de slot: ${reportData.totalMachines}
- Mașini active: ${reportData.activeMachines}
- Mașini în proprietate: ${reportData.ownedMachines}
- Mașini în leasing: ${reportData.rentedMachines}

DISTRIBUȚIE PE LOCAȚII:
${reportData.machinesByLocation.map(loc => 
`- ${loc.locationName} (${loc.city}, ${loc.county}): ${loc.totalMachines} mașini (${loc.activeMachines} active) - ${loc.company}`
).join('\n')}

DISTRIBUȚIE PE FURNIZORI:
${reportData.machinesByProvider.map(prov => 
`- ${prov.providerName}: ${prov.total} total (${prov.active} active, ${prov.owned} proprietate, ${prov.rented} leasing)`
).join('\n')}

Generat: ${format(new Date(), 'dd/MM/yyyy HH:mm')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `raport-onjn-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ONJN Reports</h1>
          <p className="text-muted-foreground">Generate compliance reports for gaming authorities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportReport} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </header>

      {/* Filters */}
      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="bg-muted border-border"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="bg-muted border-border"
              />
            </div>
            <div>
              <Label htmlFor="companyId">Company</Label>
              <Select value={filters.companyId} onValueChange={(value) => handleFilterChange('companyId', value)}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder="All companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Companies</SelectItem> {/* Use empty string for 'All' */}
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="locationId">Location</Label>
              <Select value={filters.locationId} onValueChange={(value) => handleFilterChange('locationId', value)}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Locations</SelectItem> {/* Use empty string for 'All' */}
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={generateReport} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700 w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Machines</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{reportData.totalMachines}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Machines</CardTitle>
            <FileText className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{reportData.activeMachines}</div>
            <p className="text-xs text-muted-foreground">
              {reportData.totalMachines > 0 ? 
                `${((reportData.activeMachines / reportData.totalMachines) * 100).toFixed(1)}%` : '0%'
              } of total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Owned Machines</CardTitle>
            <Building2 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{reportData.ownedMachines}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rented Machines</CardTitle>
            <FileText className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{reportData.rentedMachines}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Machines by Location */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Machines by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reportData.machinesByLocation.map((location, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <div>
                    <p className="font-medium text-foreground">{location.locationName}</p>
                    <p className="text-sm text-muted-foreground">{location.city}, {location.county}</p>
                    <p className="text-xs text-muted-foreground">{location.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{location.totalMachines}</p>
                    <p className="text-sm text-green-400">{location.activeMachines} active</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Machines by Provider */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Machines by Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reportData.machinesByProvider.map((provider, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-foreground">{provider.providerName}</p>
                    <p className="text-lg font-bold text-foreground">{provider.total}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <p className="text-green-400 font-semibold">{provider.active}</p>
                      <p className="text-muted-foreground">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-400 font-semibold">{provider.owned}</p>
                      <p className="text-muted-foreground">Owned</p>
                    </div>
                    <div className="text-center">
                      <p className="text-yellow-400 font-semibold">{provider.rented}</p>
                      <p className="text-muted-foreground">Rented</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
