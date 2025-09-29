import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { SlotMachine, Location, Company, Provider, Cabinet, GameMix, Metrology, Jackpot, Invoice, getCommissionForSlot } from '@/api/entities';
import { 
  Coins, MapPin, Building2, Factory, Monitor, Gamepad2, 
  FlaskConical, Trophy, ChevronLeft, HardHat, Info, Wrench, Calendar, Tag,
  DollarSign, TrendingUp, FileText, Download, Eye, File, Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format, differenceInDays, addYears } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start text-sm">
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
  
const getCertStatusColor = (daysLeft) => {
    if (daysLeft === null) return 'bg-background/30 text-muted-foreground border-border';
    if (daysLeft <= 30) return 'bg-red-900/30 text-red-300 border-red-700';
    if (daysLeft <= 90) return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
    return 'bg-green-900/30 text-green-300 border-green-700';
};

export default function SlotMachineDetail() {
  const [machine, setMachine] = useState(null);
  const [allData, setAllData] = useState({
    locations: [],
    companies: [],
    providers: [],
    cabinets: [],
    gameMixes: [],
    metrology: [],
    jackpots: [],
    invoices: [],
    commission: null
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const machineId = searchParams.get('id');


  useEffect(() => {
    if (!machineId) {
      setIsLoading(false);
      return;
    }
    
    const loadMachineData = async () => {
      try {
        setIsLoading(true);
        
        // Load all data in parallel
        const [
          machineData,
          locationsData,
          companiesData,
          providersData,
          cabinetsData,
          gameMixesData,
          metrologyData,
          jackpotsData,
          invoicesData
        ] = await Promise.all([
          SlotMachine.get(machineId),
          Location.list().catch(() => []),
          Company.list().catch(() => []),
          Provider.list().catch(() => []),
          Cabinet.list().catch(() => []),
          GameMix.list().catch(() => []),
          Metrology.list().catch(() => []),
          Jackpot.list().catch(() => []),
          Invoice.list().catch(() => [])
        ]);

        // Load commission data for this slot
        const commissionData = machineData?.serial_number ? 
          await getCommissionForSlot(machineData.serial_number) : null;

        setMachine(machineData);
        const filteredInvoices = invoicesData.filter(inv => inv.serial_number === machineData?.serial_number);
        
        setAllData({
          locations: locationsData,
          companies: companiesData,
          providers: providersData,
          cabinets: cabinetsData,
          gameMixes: gameMixesData,
          metrology: metrologyData.filter(cert => cert.serial_number === machineData?.serial_number),
          jackpots: jackpotsData.filter(jp => jp.serial_number === machineData?.serial_number),
          invoices: filteredInvoices,
          commission: commissionData
        });

      } catch (error) {
        console.error("Error loading slot machine details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMachineData();
  }, [machineId]);


  // Helper functions to find related data
  const getRelatedData = () => {
    if (!machine) return {};
    
    const location = allData.locations.find(l => l.id === machine.location_id);
    const company = location ? allData.companies.find(c => c.id === location.company_id) : null;
    
    // Try to find provider by ID first, then by name/manufacturer
    let provider = allData.providers.find(p => p.id === machine.provider_id);
    if (!provider && machine.manufacturer) {
      provider = allData.providers.find(p => p.name === machine.manufacturer);
    }
    
    const cabinet = allData.cabinets.find(c => c.id === machine.cabinet_id);
    const gameMix = allData.gameMixes.find(gm => gm.id === machine.game_mix_id);
    
    return {
      location,
      company,
      provider,
      cabinet,
      gameMix,
      metrology: allData.metrology,
      jackpots: allData.jackpots,
      invoices: allData.invoices,
      commission: allData.commission
    };
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading machine details...</div>;
  }

  if (!machine) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <h2 className="text-2xl text-red-400">Machine not found</h2>
        <p>The requested slot machine could not be found. It may have been deleted.</p>
        <Link to={createPageUrl('SlotMachines')}>
          <Button variant="outline" className="mt-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Slot Machines
          </Button>
        </Link>
      </div>
    );
  }

  const relatedData = getRelatedData();

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
           <Link to={createPageUrl('SlotMachines')}>
            <Button variant="outline" size="icon" className="border-border hover:bg-card">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Slot Machine: {machine.serial_number}
            </h1>
            <p className="text-muted-foreground">{machine.model}</p>
          </div>
        </div>
        <Badge className={getStatusColor(machine.status)}>{machine.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="flex items-center gap-2"><Info className="w-5 h-5 text-blue-400" />Machine Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <DetailItem icon={Tag} label="Serial Number" value={machine.serial_number} />
              <DetailItem icon={Monitor} label="Model" value={machine.model} />
              <div className="flex items-start text-sm">
                <Factory className="w-4 h-4 text-muted-foreground mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground">Provider</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={relatedData.provider?.avatar} alt={relatedData.provider?.name} />
                      <AvatarFallback className="bg-purple-900/50 text-purple-400 text-xs">
                        <Factory className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-foreground">{relatedData.provider?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <DetailItem icon={Monitor} label="Cabinet" value={relatedData.cabinet?.name} />
              <DetailItem icon={Gamepad2} label="Game Mix" value={relatedData.gameMix?.name} />
              <DetailItem icon={Calendar} label="Production Year" value={machine.production_year} />
              <DetailItem icon={Calendar} label="Commission Date" value={machine.commission_date ? format(new Date(machine.commission_date), 'PP') : 'N/A'} />
              <DetailItem icon={Wrench} label="Gaming Places" value={machine.gaming_places} />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="flex items-center gap-2"><Coins className="w-5 h-5 text-yellow-400" />Technical Specifications</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <DetailItem icon={DollarSign} label="Denomination" value={`€${machine.denomination?.toFixed(2)}`} />
              <DetailItem icon={DollarSign} label="Max Bet" value={`€${machine.max_bet?.toFixed(2)}`} />
              <DetailItem icon={TrendingUp} label="RTP" value={`${machine.rtp?.toFixed(2)}%`} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-green-400" />Location Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <DetailItem icon={MapPin} label="Location" value={relatedData.location?.name || 'Warehouse'} />
              <DetailItem icon={Building2} label="Company" value={relatedData.company?.name || 'N/A'} />
              <DetailItem icon={MapPin} label="Address" value={relatedData.location ? `${relatedData.location.address}, ${relatedData.location.city}`: 'N/A'} />
            </CardContent>
          </Card>
          
        </div>
      </div>

      {/* Commission Information Card */}
      {relatedData.commission && (
        <div className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Commission Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Commission Name
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {relatedData.commission.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Issue Date
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {relatedData.commission.data_emitere ? 
                        format(new Date(relatedData.commission.data_emitere), 'MMM d, yyyy') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Expiry Date
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {relatedData.commission.data_expirare ? 
                        format(new Date(relatedData.commission.data_expirare), 'MMM d, yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>
                {relatedData.commission.serial_numbers && relatedData.commission.serial_numbers.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Serial Numbers ({relatedData.commission.serial_count || relatedData.commission.serial_numbers.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {relatedData.commission.serial_numbers.map((sn, idx) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {sn}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Width Compliance & Metrology Card */}
      <div className="mt-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-400" />
              Compliance & Metrology
            </CardTitle>
          </CardHeader>
          <CardContent>
              {relatedData.metrology?.length > 0 ? (
                <div className="space-y-4">
                  {relatedData.metrology.map(cert => {
                    const expiryDate = cert.expiry_date || (cert.cvt_date ? addYears(new Date(cert.cvt_date), 1) : null);
                    const daysLeft = expiryDate ? differenceInDays(new Date(expiryDate), new Date()) : null;
                    const hasAttachment = cert.attachment && cert.attachment.trim() !== '';
                    
                    return (
                      <div key={cert.id} className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {cert.certificate_number}
                              </h3>
                              <Badge className={`${getCertStatusColor(daysLeft)} text-xs font-semibold px-3 py-1`}>
                                {daysLeft !== null ? `${daysLeft} days left` : 'No date'}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              Expires: {expiryDate ? format(new Date(expiryDate), 'MMM d, yyyy') : 'N/A'}
                            </p>
                            {/* Attachments */}
                            {(cert.attachments && cert.attachments.length > 0) || hasAttachment ? (
                              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                  <File className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attached Documents</span>
                                </div>
                                
                                {cert.attachments && cert.attachments.length > 0 ? (
                                  <div className="space-y-2">
                                    {cert.attachments.map((attachment, attIndex) => (
                                      <div key={attIndex} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <div className="flex items-center gap-3">
                                          <File className="w-5 h-5 text-blue-500" />
                                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {attachment.name}
                                          </span>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              const fileUrl = attachment.url || attachment.data;
                                              if (fileUrl) {
                                                console.log('Opening attachment:', fileUrl);
                                                // Check if it's a base64 data URL
                                                if (fileUrl.startsWith('data:')) {
                                                  window.open(fileUrl, '_blank');
                                                } else if (fileUrl.startsWith('http')) {
                                                  window.open(fileUrl, '_blank');
                                                } else {
                                                  // Try to open as local file
                                                  window.open(fileUrl, '_blank');
                                                }
                                              } else {
                                                console.error('No file URL found for attachment:', attachment);
                                                alert('File not found or corrupted');
                                              }
                                            }}
                                            className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                                          >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Preview
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              const fileUrl = attachment.url || attachment.data;
                                              if (fileUrl) {
                                                console.log('Downloading attachment:', fileUrl);
                                                const link = document.createElement('a');
                                                link.href = fileUrl;
                                                link.download = attachment.name;
                                                link.click();
                                              }
                                            }}
                                            className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                                          >
                                            <Download className="w-4 h-4 mr-1" />
                                            Download
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : hasAttachment ? (
                                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                      <File className="w-5 h-5 text-blue-500" />
                                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {cert.attachment}
                                      </span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const filePath = `/public/${cert.attachment}`;
                                          console.log('Opening old attachment:', filePath);
                                          try {
                                            window.open(filePath, '_blank');
                                          } catch (error) {
                                            console.error('Error opening file:', error);
                                            alert('Could not open file. Please try downloading instead.');
                                          }
                                        }}
                                        className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                                      >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Preview
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          console.log('Downloading old attachment:', `/public/${cert.attachment}`);
                                          const link = document.createElement('a');
                                          link.href = `/public/${cert.attachment}`;
                                          link.download = cert.attachment;
                                          link.click();
                                        }}
                                        className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                                      >
                                        <Download className="w-4 h-4 mr-1" />
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                <File className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No attachments available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FlaskConical className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No metrology certificates found for this machine.</p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Full Width Game Mix Games Card */}
      {relatedData.gameMix && (
        <div className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" />Jackpots</CardTitle></CardHeader>
            <CardContent>
              {relatedData.jackpots?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedData.jackpots.map(jp => (
                    <div key={jp.id} className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="font-semibold text-lg text-yellow-400">{jp.jackpot_name}</p>
                      <p className="text-2xl font-bold text-foreground">€{jp.current_amount?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground uppercase">{jp.jackpot_type}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No active jackpots configured on this machine.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Width Game Mix Games Card */}
      {relatedData.gameMix && (
        <div className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-blue-400" />
                Games in {relatedData.gameMix.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {relatedData.gameMix.games && relatedData.gameMix.games.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Total Games: {relatedData.gameMix.games.length}</span>
                    <div className="flex items-center gap-2">
                      <span>Provider:</span>
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={relatedData.provider?.avatar} alt={relatedData.provider?.name} />
                        <AvatarFallback className="bg-purple-900/50 text-purple-400 text-xs">
                          <Factory className="w-2 h-2" />
                        </AvatarFallback>
                      </Avatar>
                      <span>{relatedData.provider?.name || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {relatedData.gameMix.games.map((game, index) => (
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
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No games configured in this game mix.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Company Attachments Section */}
      {relatedData.company?.attachments && relatedData.company.attachments.length > 0 && (
        <div className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Company Documents - {relatedData.company.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {relatedData.company.attachments.map((attachment, index) => (
                  <div key={index} className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{attachment.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(attachment.url || attachment.data, '_blank')}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = attachment.url || attachment.data;
                            link.download = attachment.name;
                            link.click();
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Location Attachments Section */}
      {relatedData.location?.attachments && relatedData.location.attachments.length > 0 && (
        <div className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-400" />
                Location Documents - {relatedData.location.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {relatedData.location.attachments.map((attachment, index) => (
                  <div key={index} className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{attachment.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(attachment.url || attachment.data, '_blank')}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = attachment.url || attachment.data;
                            link.download = attachment.name;
                            link.click();
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cabinet Attachments Section */}
      {relatedData.cabinet?.attachments && relatedData.cabinet.attachments.length > 0 && (
        <div className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-400" />
                Cabinet Documents - {relatedData.cabinet.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {relatedData.cabinet.attachments.map((attachment, index) => (
                  <div key={index} className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{attachment.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(attachment.url || attachment.data, '_blank')}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = attachment.url || attachment.data;
                            link.download = attachment.name;
                            link.click();
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Associated Invoice Section */}
      <div className="mt-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Associated Invoice
            </CardTitle>
          </CardHeader>
          <CardContent>
            {relatedData.invoices?.length > 0 ? (
              <div className="space-y-4">
                {relatedData.invoices.map(invoice => {
                  return (
                    <div key={invoice.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {invoice.invoice_number}
                            </h3>
                            <Badge className={`${getStatusColor(invoice.status)} text-xs font-semibold px-3 py-1`}>
                              {invoice.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Amount
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                €{invoice.amount?.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Date
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {format(new Date(invoice.created_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          
                          {/* Attachments */}
                          {invoice.attachments && invoice.attachments.length > 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-3">
                                <File className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attached Documents</span>
                              </div>
                              
                              <div className="space-y-2">
                                {invoice.attachments.map((attachment, attIndex) => (
                                  <div key={attIndex} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                      <File className="w-5 h-5 text-blue-500" />
                                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {attachment.name}
                                      </span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const fileUrl = attachment.url || attachment.data;
                                          if (fileUrl) {
                                            console.log('Opening invoice attachment:', fileUrl);
                                            console.log('Attachment details:', attachment);
                                            
                                            // Check if it's a base64 data URL
                                            if (fileUrl.startsWith('data:')) {
                                              console.log('Opening base64 PDF');
                                              window.open(fileUrl, '_blank');
                                            } else if (fileUrl.startsWith('http')) {
                                              console.log('Opening external PDF URL');
                                              // For external PDFs, try to open in new tab
                                              const newWindow = window.open(fileUrl, '_blank');
                                              if (!newWindow) {
                                                // If popup blocked, try alternative method
                                                const link = document.createElement('a');
                                                link.href = fileUrl;
                                                link.target = '_blank';
                                                link.rel = 'noopener noreferrer';
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                              }
                                            } else {
                                              console.log('Opening local file');
                                              window.open(fileUrl, '_blank');
                                            }
                                          } else {
                                            console.error('No file URL found for attachment:', attachment);
                                            alert('File not found or corrupted');
                                          }
                                        }}
                                        className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                                      >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Preview
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const fileUrl = attachment.url || attachment.data;
                                          if (fileUrl) {
                                            console.log('Downloading invoice attachment:', fileUrl);
                                            const link = document.createElement('a');
                                            link.href = fileUrl;
                                            link.download = attachment.name;
                                            link.click();
                                          }
                                        }}
                                        className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                                      >
                                        <Download className="w-4 h-4 mr-1" />
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                              <File className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No attachments available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No invoices found for this machine.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
