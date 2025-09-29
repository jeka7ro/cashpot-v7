import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { GameMix, Provider, SlotMachine, Location, Company, Cabinet, Platform } from '@/api/entities';
import { 
  Gamepad2, Factory, MapPin, Building2, Monitor, Package, 
  ChevronLeft, Info, Calendar, Tag, Users, BarChart3,
  Trophy, Coins, HardHat, Wrench, TrendingUp, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const DetailItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-start text-sm ${className}`}>
    <Icon className="w-4 h-4 text-muted-foreground mr-3 mt-1 flex-shrink-0" />
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value || 'N/A'}</p>
    </div>
  </div>
);

const getStatusColor = (status) => {
  switch(status) {
    case 'active': return 'bg-green-900/30 text-green-300 border-green-700';
    case 'inactive': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
    case 'maintenance': return 'bg-orange-900/30 text-orange-300 border-orange-700';
    case 'storage': return 'bg-blue-900/30 text-blue-300 border-blue-700';
    default: return 'bg-background/30 text-muted-foreground border-border';
  }
};

export default function GameMixDetail() {
  const [gameMix, setGameMix] = useState(null);
  const [allData, setAllData] = useState({
    providers: [],
    slotMachines: [],
    locations: [],
    companies: [],
    cabinets: [],
    platforms: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameMixId = searchParams.get('id');

  useEffect(() => {
    if (gameMixId) {
      loadData();
    }
  }, [gameMixId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [
        gameMixData,
        providersData,
        slotMachinesData,
        locationsData,
        companiesData,
        cabinetsData,
        platformsData
      ] = await Promise.all([
        GameMix.get(gameMixId),
        Provider.list().catch(() => []),
        SlotMachine.list().catch(() => []),
        Location.list().catch(() => []),
        Company.list().catch(() => []),
        Cabinet.list().catch(() => []),
        Platform.list().catch(() => [])
      ]);

      setGameMix(gameMixData);
      setAllData({
        providers: providersData,
        slotMachines: slotMachinesData,
        locations: locationsData,
        companies: companiesData,
        cabinets: cabinetsData,
        platforms: platformsData
      });

    } catch (error) {
      console.error("Error loading game mix details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRelatedData = () => {
    if (!gameMix) return null;

    const provider = allData.providers.find(p => p.id === gameMix.provider_id);
    const platform = allData.platforms.find(p => p.id === gameMix.platform_id);
    
    // Find all slot machines using this game mix
    const relatedSlots = allData.slotMachines.filter(slot => slot.game_mix_id === gameMix.id);
    
    // Get unique locations, companies, and cabinets from related slots
    const relatedLocations = [...new Set(relatedSlots.map(slot => slot.location_id))]
      .map(locId => allData.locations.find(loc => loc.id === locId))
      .filter(Boolean);
    
    const relatedCompanies = [...new Set(relatedSlots.map(slot => slot.company_id))]
      .map(compId => allData.companies.find(comp => comp.id === compId))
      .filter(Boolean);
    
    const relatedCabinets = [...new Set(relatedSlots.map(slot => slot.cabinet_id))]
      .map(cabId => allData.cabinets.find(cab => cab.id === cabId))
      .filter(Boolean);

    return {
      provider,
      platform,
      relatedSlots,
      relatedLocations,
      relatedCompanies,
      relatedCabinets
    };
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading game mix details...</div>;
  }

  if (!gameMix) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Game Mix Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested game mix could not be found.</p>
        <Link to="/GameMixes">
          <Button variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Game Mixes
          </Button>
        </Link>
      </div>
    );
  }

  const relatedData = getRelatedData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/GameMixes">
            <Button variant="outline" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{gameMix.name}</h1>
            <p className="text-muted-foreground">Game Mix Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(gameMix.status)}>
            {gameMix.status}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem icon={Gamepad2} label="Name" value={gameMix.name} />
              <DetailItem icon={Factory} label="Provider" value={relatedData?.provider?.name} />
              <DetailItem icon={Package} label="Platform" value={relatedData?.platform?.name} />
              <DetailItem icon={Tag} label="Status" value={gameMix.status} />
              <DetailItem icon={Calendar} label="Created" value={gameMix.created_date ? format(new Date(gameMix.created_date), 'PP') : 'N/A'} />
              <DetailItem icon={Calendar} label="Updated" value={gameMix.updated_date ? format(new Date(gameMix.updated_date), 'PP') : 'N/A'} />
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{gameMix.games?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Games</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{relatedData?.relatedSlots?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Slot Machines</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{relatedData?.relatedLocations?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Locations</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{relatedData?.relatedCabinets?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Cabinets</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Related Data */}
        <div className="lg:col-span-2 space-y-6">

          {/* Locations Card */}
          {relatedData?.relatedLocations?.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  Locations ({relatedData.relatedLocations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {relatedData.relatedLocations.map(location => (
                    <div key={location.id} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-foreground">{location.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cabinets Card */}
          {relatedData?.relatedCabinets?.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-purple-400" />
                  Cabinets ({relatedData.relatedCabinets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {relatedData.relatedCabinets.map(cabinet => (
                    <div key={cabinet.id} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-foreground">{cabinet.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Full Width Games Card */}
      <div className="mt-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-blue-400" />
              Games ({gameMix.games?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gameMix.games && gameMix.games.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {gameMix.games.map((game, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-foreground truncate" title={game}>
                        {game}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No games configured in this game mix.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full Width Slot Machines Card */}
      {relatedData?.relatedSlots?.length > 0 && (
        <div className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                Slot Machines ({relatedData.relatedSlots.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Serial Number</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Location</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Company</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Cabinet</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Provider</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Production Year</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Commission Date</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Gaming Places</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedData.relatedSlots.map(slot => {
                      const location = allData.locations.find(loc => loc.id === slot.location_id);
                      const company = allData.companies.find(comp => comp.id === slot.company_id);
                      const cabinet = allData.cabinets.find(cab => cab.id === slot.cabinet_id);
                      const provider = allData.providers.find(prov => prov.id === slot.provider_id);
                      
                      return (
                        <tr key={slot.id} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm font-medium text-foreground">{slot.serial_number}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-foreground">{location?.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-foreground">{company?.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Monitor className="w-4 h-4 text-purple-400" />
                              <span className="text-sm text-foreground">{cabinet?.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Factory className="w-4 h-4 text-orange-400" />
                              <span className="text-sm text-foreground">{provider?.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(slot.status)}>
                              {slot.status || 'Unknown'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-foreground">{slot.production_year || 'N/A'}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-foreground">
                              {slot.commission_date ? format(new Date(slot.commission_date), 'MMM dd, yyyy') : 'N/A'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-foreground">{slot.gaming_places || 'N/A'}</span>
                          </td>
                          <td className="p-3">
                            <Link to={`/SlotMachineDetail?id=${slot.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
