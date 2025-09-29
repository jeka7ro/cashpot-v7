// Function to convert data to objects
export function convertSheetsDataToObjects(data, headers) {
  return data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

// Function to parse slot machine data
export function parseSlotMachineData(sheetsData) {
  if (!sheetsData || sheetsData.length < 2) {
    return [];
  }
  
  const dataRows = sheetsData.slice(1);
  
  return dataRows.map((row, index) => {
    const [location, serialNumber, provider, cabinet, gameMix] = row;
    
    return {
      id: `slot-${index + 1}`,
      serial_number: serialNumber || '',
      manufacturer: provider || '',
      model: cabinet || '',
      location: location || '',
      game_mix: gameMix || '',
      // Map to IDs that the frontend expects
      provider_id: getProviderIdByName(provider),
      location_id: getLocationIdByName(location),
      cabinet_id: getCabinetIdByName(cabinet),
      game_mix_id: getGameMixIdByName(gameMix),
      rtp: getRandomRTP(),
      status: 'active',
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
  }).filter(slot => slot.serial_number && slot.manufacturer);
}

// Helper function to generate random RTP
function getRandomRTP() {
  const rtps = [95.5, 95.8, 96.0, 96.2, 96.5, 95.95, 95.75];
  return rtps[Math.floor(Math.random() * rtps.length)];
}

// Helper functions to get IDs by name
function getProviderIdByName(providerName) {
  const providers = ['EGT', 'Alfastreet', 'Novomatic', 'IGT', 'InterBlock', 'Amusnet', 'Casino Technology'];
  const index = providers.indexOf(providerName);
  return index >= 0 ? `prov-${index + 1}` : 'prov-1';
}

function getLocationIdByName(locationName) {
  const locations = ['Pitesti', 'Valcea', 'Craiova', 'Ploiesti (centru)', 'Ploiesti (nord)'];
  const index = locations.indexOf(locationName);
  return index >= 0 ? `loc-${index + 1}` : 'loc-1';
}

function getCabinetIdByName(cabinetName) {
  const cabinets = [
    'Alfastreet Live', 'VIP 27/2x42', 'P42V Curved ST', 'P42V Curved UP', 'G 55" C VIP',
    'P 32/32 H ST', 'G 50" C ST', 'P 27/27 ST', 'S-Line 32/55', 'G 32/32 ST VIP',
    'Upright 623A', 'VIP Eagle III FV880A', 'Peakslant 49', 'G 27/32 ST', 'Terminal Live',
    'AMS-ST-50', 'Next', 'VIP Lounge FV834'
  ];
  const index = cabinets.indexOf(cabinetName);
  return index >= 0 ? `cab-${index + 1}` : 'cab-1';
}

function getGameMixIdByName(gameMixName) {
  const gameMixes = [
    'Post 1', 'Post 2', 'Purple Collection', 'Green Collection', 'Orange Collection',
    'Union Collection', 'Fruits Collection 2', 'Gold Collection HD', 'Blue Power HD',
    'Blue General HD', 'Mega Supreme Fruits Selection', 'King Collection 4',
    'Bell Link 1', 'Bell Link 2', 'Mega Supreme Green Selection', 'The Legend 3',
    'Impera 7 HD', 'Edition Orange', 'Edition Azure', 'Organic G4', 'Amusebox',
    'Diamond King 2', 'Diamond King 3', 'Red Collection'
  ];
  const index = gameMixes.indexOf(gameMixName);
  return index >= 0 ? `mix-${index + 1}` : 'mix-1';
}

// Function to extract unique locations
export function getUniqueLocations(slotMachines) {
  if (!slotMachines || slotMachines.length === 0) {
    return [];
  }
  
  const locations = [...new Set(slotMachines.map(slot => slot.location))];
  return locations.map((location, index) => ({
    id: `loc-${index + 1}`,
    name: location,
    address: `${location}, România`,
    company_id: '1',
    phone: '0212345678',
    email: `${location.toLowerCase()}@base44.com`,
    created_date: new Date().toISOString()
  }));
}

// Function to extract unique manufacturers
export function getUniqueManufacturers(slotMachines) {
  if (!slotMachines || slotMachines.length === 0) {
    return [];
  }
  
  // Use the same order as getProviderIdByName
  const providerOrder = ['EGT', 'Alfastreet', 'Novomatic', 'IGT', 'InterBlock', 'Amusnet', 'Casino Technology'];
  const manufacturers = [...new Set(slotMachines.map(slot => slot.manufacturer))];
  
  // Sort manufacturers according to the fixed order
  const sortedManufacturers = manufacturers.sort((a, b) => {
    const indexA = providerOrder.indexOf(a);
    const indexB = providerOrder.indexOf(b);
    return indexA - indexB;
  });

  return sortedManufacturers.map((manufacturer, index) => ({
    id: `prov-${index + 1}`,
    name: manufacturer,
    contact_person: `${manufacturer} Contact`,
    phone: '0043123456789',
    email: `${manufacturer.toLowerCase().replace(/\s+/g, '')}@example.com`,
    created_date: new Date().toISOString()
  }));
}

// Function to extract unique game mixes
export function getUniqueGameMixes(slotMachines) {
  if (!slotMachines || slotMachines.length === 0) {
    return [];
  }
  
  // Create a map of game mixes to their providers
  const gameMixProviderMap = {};
  slotMachines.forEach(slot => {
    if (slot.manufacturer && slot.game_mix) {
      gameMixProviderMap[slot.game_mix] = slot.manufacturer;
    }
  });
  
  const mixes = [...new Set(slotMachines.map(slot => slot.game_mix))];
  return mixes.map((mix, index) => ({
    id: `mix-${index + 1}`,
    name: mix,
    provider_id: getProviderIdByName(gameMixProviderMap[mix] || 'EGT'), // Use the correct provider for each game mix
    rtp: (95 + Math.random() * 5).toFixed(1),
    volatility: ['low', 'medium', 'high'][index % 3],
    created_date: new Date().toISOString()
  }));
}

// Function to extract unique cabinets
export function getUniqueCabinets(slotMachines) {
  if (!slotMachines || slotMachines.length === 0) {
    return [];
  }
  
  // Create a map of cabinet models to their providers
  const cabinetProviderMap = {};
  slotMachines.forEach(slot => {
    if (slot.manufacturer && slot.model) {
      cabinetProviderMap[slot.model] = slot.manufacturer;
    }
  });
  
  const cabinets = [...new Set(slotMachines.map(slot => slot.model))];
  return cabinets.map((cabinet, index) => ({
    id: `cab-${index + 1}`,
    name: cabinet, // Use the actual cabinet model name
    location_id: ((index % 5) + 1).toString(),
    status: 'active',
    manufacturer: cabinetProviderMap[cabinet] || 'EGT', // Use the correct provider for each cabinet
    provider_id: getProviderIdByName(cabinetProviderMap[cabinet] || 'EGT'), // Add provider_id for frontend
    model: `CAB${(index + 1).toString().padStart(3, '0')}`, // Different from name
    serial_number: `CAB${(index + 1).toString().padStart(3, '0')}`,
    created_date: new Date().toISOString()
  }));
}

// Function to get data (hardcoded)
export async function getGoogleSheetsData(range) {
  try {
    console.log(`Fetching data for range: ${range}`);

    if (range.includes('SlotMachines')) {
      return [
        ['Location', 'Serial number', 'Provider', 'Cabinet', 'Game Mix'],
               ['Pitesti', '2522046669', 'Alfastreet', 'Alfastreet Live', 'Post 1'],
               ['Pitesti', '2522046670', 'Alfastreet', 'Alfastreet Live', 'Post 2'],
        ['Pitesti', '134862', 'EGT', 'VIP 27/2x42', 'Purple Collection'],
        ['Pitesti', '135226', 'EGT', 'VIP 27/2x42', 'Green Collection'],
        ['Pitesti', '149582', 'EGT', 'VIP 27/2x42', 'Orange Collection'],
        ['Pitesti', '149583', 'EGT', 'VIP 27/2x42', 'Green Collection'],
        ['Pitesti', '149621', 'EGT', 'P42V Curved ST', 'Union Collection'],
        ['Pitesti', '149612', 'EGT', 'P42V Curved ST', 'Orange Collection'],
        ['Pitesti', '149628', 'EGT', 'P42V Curved ST', 'Purple Collection'],
        ['Pitesti', '149614', 'EGT', 'P42V Curved ST', 'Orange Collection'],
        ['Pitesti', '142270', 'EGT', 'P42V Curved UP', 'Union Collection'],
        ['Pitesti', '150246', 'EGT', 'P42V Curved UP', 'Fruits Collection 2'],
        ['Pitesti', '150247', 'EGT', 'P42V Curved UP', 'Gold Collection HD'],
        ['Pitesti', '155706', 'EGT', 'P42V Curved UP', 'Purple Collection'],
        ['Pitesti', '142848', 'EGT', 'P42V Curved UP', 'Purple Collection'],
        ['Pitesti', '142851', 'EGT', 'P42V Curved UP', 'Fruits Collection 2'],
        ['Pitesti', '150243', 'EGT', 'P42V Curved UP', 'Orange Collection'],
        ['Pitesti', '142855', 'EGT', 'P42V Curved UP', 'Gold Collection HD'],
        ['Pitesti', '150242', 'EGT', 'P42V Curved UP', 'Green Collection'],
        ['Pitesti', '235415', 'EGT', 'G 55" C VIP', 'Blue Power HD'],
        ['Pitesti', '235423', 'EGT', 'G 55" C VIP', 'Blue General HD'],
        ['Pitesti', '235414', 'EGT', 'G 55" C VIP', 'Blue Power HD'],
        ['Pitesti', '235419', 'EGT', 'G 55" C VIP', 'Blue General HD'],
        ['Pitesti', '299720', 'EGT', 'G 55" C VIP', 'Mega Supreme Fruits Selection'],
        ['Pitesti', '118857', 'EGT', 'P 32/32 H ST', 'Fruits Collection 2'],
        ['Pitesti', '118858', 'EGT', 'P 32/32 H ST', 'Gold Collection HD'],
        ['Pitesti', '235428', 'EGT', 'G 50" C ST', 'Blue General HD'],
        ['Pitesti', '235430', 'EGT', 'G 50" C ST', 'Blue Power HD'],
        ['Pitesti', '149589', 'EGT', 'P 27/27 ST', 'Green Collection'],
        ['Pitesti', '149585', 'EGT', 'VIP 27/2x42', 'Orange Collection'],
        ['Pitesti', '149592', 'EGT', 'P 27/27 ST', 'Purple Collection'],
        ['Pitesti', '149588', 'EGT', 'P 27/27 ST', 'Union Collection'],
        ['Pitesti', '149584', 'EGT', 'P 27/27 ST', 'Orange Collection'],
        ['Pitesti', '149593', 'EGT', 'P 27/27 ST', 'Purple Collection'],
        ['Pitesti', '149635', 'EGT', 'P42V Curved ST', 'Union Collection'],
        ['Pitesti', '149636', 'EGT', 'P42V Curved ST', 'Union Collection'],
        ['Pitesti', '149637', 'EGT', 'P42V Curved ST', 'Purple Collection'],
        ['Pitesti', '149638', 'EGT', 'P42V Curved ST', 'Purple Collection'],
        ['Pitesti', '235429', 'EGT', 'G 50" C ST', 'Blue General HD'],
        ['Pitesti', '235431', 'EGT', 'G 50" C ST', 'Blue Power HD'],
        ['Pitesti', '233060', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Pitesti', '233062', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Pitesti', '233056', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Pitesti', '150244', 'EGT', 'P42V Curved UP', 'Fruits Collection 2'],
        ['Pitesti', '155700', 'EGT', 'P42V Curved UP', 'Gold Collection HD'],
        ['Pitesti', '155707', 'EGT', 'P42V Curved UP', 'Union Collection'],
        ['Pitesti', '233059', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Pitesti', '233055', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Pitesti', '233057', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Pitesti', '200406', 'EGT', 'G 32/32 ST VIP', 'Bell Link 1'],
        ['Pitesti', '200407', 'EGT', 'G 32/32 ST VIP', 'Bell Link 2'],
        ['Pitesti', '200408', 'EGT', 'G 32/32 ST VIP', 'Bell Link 1'],
        ['Pitesti', '200409', 'EGT', 'G 32/32 ST VIP', 'Bell Link 2'],
        ['Pitesti', '200410', 'EGT', 'G 32/32 ST VIP', 'Bell Link 1'],
        ['Pitesti', '200411', 'EGT', 'G 32/32 ST VIP', 'Bell Link 2'],
        ['Pitesti', '299737', 'EGT', 'G 55" C VIP', 'Mega Supreme Fruits Selection'],
        ['Pitesti', '299721', 'EGT', 'G 55" C VIP', 'Mega Supreme Green Selection'],
        ['Pitesti', '299723', 'EGT', 'G 55" C VIP', 'Mega Supreme Fruits Selection'],
        ['Pitesti', '299722', 'EGT', 'G 55" C VIP', 'Mega Supreme Green Selection'],
        ['Pitesti', '150253', 'Novomatic', 'Upright 623A', 'The Legend 3'],
        ['Pitesti', '150252', 'Novomatic', 'Upright 623A', 'The Legend 3'],
        ['Pitesti', '150053', 'Novomatic', 'Upright 623A', 'The Legend 3'],
        ['Pitesti', '155719', 'Novomatic', 'Upright 623A', 'The Legend 3'],
        ['Pitesti', '169130', 'Novomatic', 'Upright 623A', 'The Legend 3'],
        ['Pitesti', '544159', 'Novomatic', 'Upright 623A', 'The Legend 3'],
        ['Pitesti', '233030', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Pitesti', '233031', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Pitesti', '233032', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Pitesti', '233029', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Pitesti', '798916', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Pitesti', '798915', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Pitesti', '200425', 'EGT', 'VIP 27/2x42', 'Purple Collection'],
        ['Pitesti', '200426', 'EGT', 'VIP 27/2x42', 'Gold Collection HD'],
        ['Pitesti', '798918', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Pitesti', '798917', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Pitesti', '2549887', 'IGT', 'Peakslant 49', 'Edition Orange'],
        ['Pitesti', '2549886', 'IGT', 'Peakslant 49', 'Edition Azure'],
        ['Pitesti', '2548499', 'IGT', 'Peakslant 49', 'Edition Azure'],
        ['Pitesti', '2548500', 'IGT', 'Peakslant 49', 'Edition Orange'],
        ['Pitesti', '190268', 'EGT', 'G 27/32 ST', 'Bell Link 2'],
        ['Pitesti', '190269', 'EGT', 'G 27/32 ST', 'Bell Link 1'],
        ['Pitesti', '190270', 'EGT', 'G 27/32 ST', 'Bell Link 2'],
        ['Pitesti', '190271', 'EGT', 'G 27/32 ST', 'Bell Link 1'],
        ['Pitesti', '190273', 'EGT', 'G 27/32 ST', 'Bell Link 1'],
        ['Pitesti', '190274', 'EGT', 'G 27/32 ST', 'Bell Link 2'],
        ['Pitesti', '9134161533', 'InterBlock', 'Terminal Live', 'Organic G4'],
        ['Pitesti', '9134161532', 'InterBlock', 'Terminal Live', 'Organic G4'],
        ['Pitesti', '9134161534', 'InterBlock', 'Terminal Live', 'Organic G4'],
        ['Pitesti', '9134162900', 'InterBlock', 'Terminal Live', 'Organic G4'],
        ['Pitesti', '100394', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Pitesti', '100399', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Pitesti', '100398', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Pitesti', '100395', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Pitesti', '100396', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Pitesti', '100397', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Valcea', '142850', 'EGT', 'P42V Curved UP', 'Purple Collection'],
        ['Valcea', '142847', 'EGT', 'P42V Curved UP', 'Union Collection'],
        ['Valcea', '190281', 'EGT', 'G 27/32 ST', 'Bell Link 1'],
        ['Valcea', '190282', 'EGT', 'G 27/32 ST', 'Bell Link 2'],
        ['Valcea', '190283', 'EGT', 'G 27/32 ST', 'Bell Link 1'],
        ['Valcea', '190284', 'EGT', 'G 27/32 ST', 'Bell Link 2'],
        ['Valcea', '149606', 'EGT', 'P 32/32 H ST', 'Purple Collection'],
        ['Valcea', '149596', 'EGT', 'P 32/32 H ST', 'Orange Collection'],
        ['Valcea', '149602', 'EGT', 'P 32/32 H ST', 'Green Collection'],
        ['Valcea', '149605', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Valcea', '798920', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Valcea', '798921', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Valcea', '798922', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Valcea', '200417', 'EGT', 'G 32/32 ST VIP', 'Bell Link 1'],
        ['Valcea', '200418', 'EGT', 'G 32/32 ST VIP', 'Bell Link 2'],
        ['Valcea', '200420', 'EGT', 'G 32/32 ST VIP', 'Bell Link 2'],
        ['Valcea', '200419', 'EGT', 'G 32/32 ST VIP', 'Bell Link 1'],
        ['Valcea', '233063', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Valcea', '233064', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Valcea', '233067', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Valcea', '233068', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Valcea', '233069', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Valcea', '233070', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Valcea', '235417', 'EGT', 'G 55" C VIP', 'Bell Link 1'],
        ['Valcea', '235421', 'EGT', 'G 55" C VIP', 'Bell Link 1'],
        ['Valcea', '235425', 'EGT', 'G 55" C VIP', 'Bell Link 1'],
        ['Valcea', '299727', 'EGT', 'G 55" C VIP', 'Mega Supreme Fruits Selection'],
        ['Valcea', '299728', 'EGT', 'G 55" C VIP', 'Mega Supreme Green Selection'],
        ['Valcea', '130693', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Valcea', '130694', 'EGT', 'P 32/32 H ST', 'Fruits Collection 2'],
        ['Valcea', '130695', 'EGT', 'P 32/32 H ST', 'Green Collection'],
        ['Valcea', '130696', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Valcea', '729350', 'Novomatic', 'VIP Lounge FV834', 'Impera 7 HD'],
        ['Valcea', '729349', 'Novomatic', 'VIP Lounge FV834', 'Impera 7 HD'],
        ['Valcea', '118862', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Valcea', '118863', 'EGT', 'P 32/32 H ST', 'Fruits Collection 2'],
        ['Valcea', '135227', 'EGT', 'VIP 27/2x42', 'Green Collection'],
        ['Valcea', '134863', 'EGT', 'VIP 27/2x42', 'Orange Collection'],
        ['Valcea', '191501', 'EGT', 'VIP 27/2x42', 'Purple Collection'],
        ['Valcea', '149623', 'EGT', 'P42V Curved ST', 'Green Collection'],
        ['Valcea', '149633', 'EGT', 'P42V Curved ST', 'Purple Collection'],
        ['Valcea', '155708', 'EGT', 'P42V Curved UP', 'Fruits Collection 2'],
        ['Valcea', '155709', 'EGT', 'P42V Curved UP', 'Union Collection'],
        ['Valcea', '155710', 'EGT', 'P42V Curved UP', 'Gold Collection HD'],
        ['Valcea', '149610', 'EGT', 'P42V Curved ST', 'Union Collection'],
        ['Valcea', '149617', 'EGT', 'P42V Curved ST', 'Green Collection'],
        ['Valcea', '149613', 'EGT', 'P42V Curved ST', 'Orange Collection'],
        ['Valcea', '149629', 'EGT', 'P42V Curved ST', 'Union Collection'],
        ['Craiova', '135228', 'EGT', 'VIP 27/2x42', 'Green Collection'],
        ['Craiova', '135225', 'EGT', 'VIP 27/2x42', 'Orange Collection'],
        ['Craiova', '130678', 'EGT', 'P 27/27 ST', 'Red Collection'],
        ['Craiova', '130680', 'EGT', 'P 27/27 ST', 'Green Collection'],
        ['Craiova', '130677', 'EGT', 'P 27/27 ST', 'Orange Collection'],
        ['Craiova', '130681', 'EGT', 'P 27/27 ST', 'Red Collection'],
        ['Craiova', '130676', 'EGT', 'P 27/27 ST', 'Orange Collection'],
        ['Craiova', '130679', 'EGT', 'P 27/27 ST', 'Green Collection'],
        ['Craiova', '2304-501', 'Casino Technology', 'Next', 'Diamond King 2'],
        ['Craiova', '2304-502', 'Casino Technology', 'Next', 'Diamond King 3'],
        ['Craiova', '2303-547', 'Casino Technology', 'Next', 'Diamond King 2'],
        ['Craiova', '2304-504', 'Casino Technology', 'Next', 'Diamond King 3'],
        ['Craiova', '233025', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Craiova', '233028', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Craiova', '233072', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Craiova', '149594', 'EGT', 'P 27/27 ST', 'Purple Collection'],
        ['Craiova', '149586', 'EGT', 'P 27/27 ST', 'Orange Collection'],
        ['Craiova', '149591', 'EGT', 'P 27/27 ST', 'Union Collection'],
        ['Craiova', '149590', 'EGT', 'P 27/27 ST', 'Union Collection'],
        ['Craiova', '149595', 'EGT', 'P 27/27 ST', 'Union Collection'],
        ['Craiova', '149587', 'EGT', 'P 27/27 ST', 'Orange Collection'],
        ['Craiova', '233071', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Craiova', '233027', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Craiova', '233074', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Craiova', '118868', 'EGT', 'P 32/32 H ST', 'Fruits Collection 2'],
        ['Craiova', '118873', 'EGT', 'P 32/32 H ST', 'Gold Collection HD'],
        ['Craiova', '118856', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Craiova', '118874', 'EGT', 'P 32/32 H ST', 'Gold Collection HD'],
        ['Craiova', '130683', 'EGT', 'P 32/32 H ST', 'Red Collection'],
        ['Craiova', '130686', 'EGT', 'P 32/32 H ST', 'Green Collection'],
        ['Craiova', '130684', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Craiova', '130685', 'EGT', 'P 32/32 H ST', 'Red Collection'],
        ['Craiova', '130682', 'EGT', 'P 32/32 H ST', 'Orange Collection'],
        ['Craiova', '130687', 'EGT', 'P 32/32 H ST', 'Purple Collection'],
        ['Craiova', '118865', 'EGT', 'P 32/32 H ST', 'Fruits Collection 2'],
        ['Craiova', '118875', 'EGT', 'P 32/32 H ST', 'Purple Collection'],
        ['Craiova', '194603', 'Novomatic', 'Upright 623A', 'The Legend 3'],
        ['Craiova', '238776', 'Novomatic', 'Upright 623A', 'The Legend 3'],
        ['Craiova', '200412', 'EGT', 'G 32/32 ST VIP', 'Bell Link 1'],
        ['Craiova', '200413', 'EGT', 'G 32/32 ST VIP', 'Bell Link 2'],
        ['Craiova', '200414', 'EGT', 'G 32/32 ST VIP', 'Bell Link 1'],
        ['Craiova', '200416', 'EGT', 'G 32/32 ST VIP', 'Bell Link 2'],
        ['Craiova', '2304-505', 'Casino Technology', 'Next', 'Diamond King 3'],
        ['Craiova', '2304-500', 'Casino Technology', 'Next', 'Diamond King 2'],
        ['Craiova', '2304-503', 'Casino Technology', 'Next', 'Diamond King 3'],
        ['Craiova', '2303-525', 'Casino Technology', 'Next', 'Diamond King 2'],
        ['Craiova', '191500', 'EGT', 'VIP 27/2x42', 'Purple Collection'],
        ['Craiova', '190275', 'EGT', 'G 27/32 ST', 'Bell Link 1'],
        ['Craiova', '190277', 'EGT', 'G 27/32 ST', 'Bell Link 2'],
        ['Craiova', '190278', 'EGT', 'G 27/32 ST', 'Bell Link 1'],
        ['Craiova', '190279', 'EGT', 'G 27/32 ST', 'Bell Link 2'],
        ['Craiova', '729346', 'Novomatic', 'VIP Lounge FV834', 'Impera 7 HD'],
        ['Craiova', '729347', 'Novomatic', 'VIP Lounge FV834', 'Impera 7 HD'],
        ['Craiova', '798923', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Craiova', '798924', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Craiova', '235416', 'EGT', 'G 55" C VIP', 'Blue General HD'],
        ['Craiova', '235427', 'EGT', 'G 55" C VIP', 'Blue Power HD'],
        ['Craiova', '235424', 'EGT', 'G 55" C VIP', 'Blue General HD'],
        ['Craiova', '235420', 'EGT', 'G 55" C VIP', 'Bell Link 1'],
        ['Craiova', '299734', 'EGT', 'G 55" C VIP', 'Mega Supreme Fruits Selection'],
        ['Craiova', '299735', 'EGT', 'G 55" C VIP', 'Mega Supreme Green Selection'],
        ['Craiova', '299736', 'EGT', 'G 55" C VIP', 'Mega Supreme Fruits Selection'],
        ['Craiova', '9134161528', 'InterBlock', 'Terminal Live', 'Organic G4'],
        ['Craiova', '9134162902', 'InterBlock', 'Terminal Live', 'Organic G4'],
        ['Craiova', '9134172859', 'InterBlock', 'Terminal Live', 'Organic G4'],
        ['Craiova', '2523057149', 'Alfastreet', 'Alfastreet Live', 'Post 1'],
        ['Craiova', '2523057150', 'Alfastreet', 'Alfastreet Live', 'Post 2'],
        ['Craiova', '100388', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Craiova', '100389', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Craiova', '100390', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Craiova', '100391', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Craiova', '100392', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Craiova', '100393', 'Amusnet', 'AMS-ST-50', 'Amusebox'],
        ['Ploiesti (centru)', '190285', 'EGT', 'G 27/32 ST', 'Bell Link 1'],
        ['Ploiesti (centru)', '190286', 'EGT', 'G 27/32 ST', 'Bell Link 2'],
        ['Ploiesti (centru)', '190287', 'EGT', 'G 27/32 ST', 'Bell Link 1'],
        ['Ploiesti (centru)', '190288', 'EGT', 'G 27/32 ST', 'Bell Link 2'],
        ['Ploiesti (centru)', '149581', 'EGT', 'VIP 27/2x42', 'Purple Collection'],
        ['Ploiesti (centru)', '149580', 'EGT', 'VIP 27/2x42', 'Purple Collection'],
        ['Ploiesti (centru)', '233048', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Ploiesti (centru)', '233050', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Ploiesti (centru)', '233049', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Ploiesti (centru)', '149598', 'EGT', 'P 32/32 H ST', 'Orange Collection'],
        ['Ploiesti (centru)', '149599', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Ploiesti (centru)', '149597', 'EGT', 'P 32/32 H ST', 'Orange Collection'],
        ['Ploiesti (centru)', '149600', 'EGT', 'P 32/32 H ST', 'Orange Collection'],
        ['Ploiesti (centru)', '149604', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Ploiesti (centru)', '149609', 'EGT', 'P 32/32 H ST', 'Purple Collection'],
        ['Ploiesti (centru)', '149608', 'EGT', 'P 32/32 H ST', 'Purple Collection'],
        ['Ploiesti (centru)', '149603', 'EGT', 'P 32/32 H ST', 'Green Collection'],
        ['Ploiesti (centru)', '233052', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Ploiesti (centru)', '118866', 'EGT', 'P 32/32 H ST', 'Gold Collection HD'],
        ['Ploiesti (centru)', '149607', 'EGT', 'P 32/32 H ST', 'Purple Collection'],
        ['Ploiesti (centru)', '149601', 'EGT', 'P 32/32 H ST', 'Purple Collection'],
        ['Ploiesti (centru)', '149631', 'EGT', 'P42V Curved ST', 'Union Collection'],
        ['Ploiesti (centru)', '149630', 'EGT', 'P42V Curved ST', 'Union Collection'],
        ['Ploiesti (centru)', '149622', 'EGT', 'P42V Curved ST', 'Green Collection'],
        ['Ploiesti (centru)', '149632', 'EGT', 'P42V Curved ST', 'Purple Collection'],
        ['Ploiesti (centru)', '200421', 'EGT', 'G 32/32 ST VIP', 'Bell Link 1'],
        ['Ploiesti (centru)', '200423', 'EGT', 'G 32/32 ST VIP', 'Bell Link 2'],
        ['Ploiesti (centru)', '200424', 'EGT', 'G 32/32 ST VIP', 'Bell Link 1'],
        ['Ploiesti (centru)', '798919', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Ploiesti (centru)', '798925', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Ploiesti (centru)', '798926', 'Novomatic', 'VIP Eagle III FV880A', 'Impera 7 HD'],
        ['Ploiesti (centru)', '299739', 'EGT', 'G 55" C VIP', 'Mega Supreme Green Selection'],
        ['Ploiesti (centru)', '299738', 'EGT', 'G 55" C VIP', 'Mega Supreme Fruits Selection'],
        ['Ploiesti (centru)', '299740', 'EGT', 'G 55" C VIP', 'Mega Supreme Fruits Selection'],
        ['Ploiesti (centru)', '299741', 'EGT', 'G 55" C VIP', 'Mega Supreme Green Selection'],
        ['Ploiesti (centru)', '9134161529', 'InterBlock', 'Terminal Live', 'Organic G4'],
        ['Ploiesti (centru)', '9134161530', 'InterBlock', 'Terminal Live', 'Organic G4'],
        ['Ploiesti (centru)', '233038', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Ploiesti (centru)', '233040', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Ploiesti (nord)', '235411', 'EGT', 'VIP 27/2x42', 'Purple Collection'],
        ['Ploiesti (nord)', '235413', 'EGT', 'VIP 27/2x42', 'Fruits Collection 2'],
        ['Ploiesti (nord)', '235412', 'EGT', 'VIP 27/2x42', 'Gold Collection HD'],
        ['Ploiesti (nord)', '149634', 'EGT', 'P42V Curved ST', 'Purple Collection'],
        ['Ploiesti (nord)', '149620', 'EGT', 'P42V Curved ST', 'Green Collection'],
        ['Ploiesti (nord)', '149616', 'EGT', 'P42V Curved ST', 'Orange Collection'],
        ['Ploiesti (nord)', '118859', 'EGT', 'P 32/32 H ST', 'Gold Collection HD'],
        ['Ploiesti (nord)', '118860', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Ploiesti (nord)', '118861', 'EGT', 'P 32/32 H ST', 'Fruits Collection 2'],
        ['Ploiesti (nord)', '118872', 'EGT', 'P 32/32 H ST', 'Purple Collection'],
        ['Ploiesti (nord)', '118869', 'EGT', 'P 32/32 H ST', 'Purple Collection'],
        ['Ploiesti (nord)', '118864', 'EGT', 'P 32/32 H ST', 'Gold Collection HD'],
        ['Ploiesti (nord)', '118871', 'EGT', 'P 32/32 H ST', 'Purple Collection'],
        ['Ploiesti (nord)', '118870', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Ploiesti (nord)', '299724', 'EGT', 'G 55" C VIP', 'Mega Supreme Fruits Selection'],
        ['Ploiesti (nord)', '299725', 'EGT', 'G 55" C VIP', 'Mega Supreme Green Selection'],
        ['Ploiesti (nord)', '299726', 'EGT', 'G 55" C VIP', 'Mega Supreme Fruits Selection'],
        ['Ploiesti (nord)', '149615', 'EGT', 'P42V Curved ST', 'Purple Collection'],
        ['Ploiesti (nord)', '190276', 'EGT', 'G 27/32 ST', 'Bell Link 1'],
        ['Ploiesti (nord)', '190267', 'EGT', 'G 27/32 ST', 'Bell Link 1'],
        ['Ploiesti (nord)', '190280', 'EGT', 'G 27/32 ST', 'Bell Link 2'],
        ['Ploiesti (nord)', '190272', 'EGT', 'G 27/32 ST', 'Bell Link 2'],
        ['Ploiesti (nord)', '118867', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Ploiesti (nord)', '132665', 'Novomatic', 'Upright 623A', 'The Legend 3'],
        ['Ploiesti (nord)', '141053', 'Novomatic', 'Upright 623A', 'The Legend 3'],
        ['Ploiesti (nord)', '131919', 'Novomatic', 'Upright 623A', 'The Legend 3'],
        ['Ploiesti (nord)', '149611', 'EGT', 'P42V Curved ST', 'Union Collection'],
        ['Ploiesti (nord)', '149618', 'EGT', 'P42V Curved ST', 'Green Collection'],
        ['Ploiesti (nord)', '149624', 'EGT', 'P42V Curved ST', 'Purple Collection'],
        ['Ploiesti (nord)', '149625', 'EGT', 'P42V Curved ST', 'Union Collection'],
        ['Ploiesti (nord)', '233043', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Ploiesti (nord)', '233042', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Ploiesti (nord)', '233036', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Ploiesti (nord)', '233041', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Ploiesti (nord)', '233039', 'EGT', 'S-Line 32/55', 'King Collection 4'],
        ['Ploiesti (nord)', '235422', 'EGT', 'G 55" C VIP', 'Bell Link 1'],
        ['Ploiesti (nord)', '235426', 'EGT', 'G 55" C VIP', 'Bell Link 1'],
        ['Ploiesti (nord)', '235418', 'EGT', 'G 55" C VIP', 'Bell Link 1'],
        ['Ploiesti (nord)', '149627', 'EGT', 'P42V Curved ST', 'Purple Collection'],
        ['Ploiesti (nord)', '149619', 'EGT', 'P42V Curved ST', 'Union Collection'],
        ['Ploiesti (nord)', '149626', 'EGT', 'P42V Curved ST', 'Purple Collection'],
        ['Ploiesti (nord)', '130688', 'EGT', 'P 32/32 H ST', 'Fruits Collection 2'],
        ['Ploiesti (nord)', '130689', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Ploiesti (nord)', '130690', 'EGT', 'P 32/32 H ST', 'Purple Collection'],
        ['Ploiesti (nord)', '130691', 'EGT', 'P 32/32 H ST', 'Fruits Collection 2'],
        ['Ploiesti (nord)', '130692', 'EGT', 'P 32/32 H ST', 'Union Collection'],
        ['Ploiesti (nord)', '142852', 'EGT', 'P42V Curved UP', 'Fruits Collection 2'],
        ['Ploiesti (nord)', '142845', 'EGT', 'P42V Curved UP', 'Union Collection'],
        ['Ploiesti (nord)', '142854', 'EGT', 'P42V Curved UP', 'Gold Collection HD'],
        ['Ploiesti (nord)', '2547366', 'IGT', 'Peakslant 49', 'Edition Orange'],
        ['Ploiesti (nord)', '2547364', 'IGT', 'Peakslant 49', 'Edition Azure'],
        ['Ploiesti (nord)', '2538645', 'IGT', 'Peakslant 49', 'Edition Orange'],
        ['Ploiesti (nord)', '2538644', 'IGT', 'Peakslant 49', 'Edition Azure'],
        ['Ploiesti (nord)', '9134162899', 'InterBlock', 'Terminal Live', 'Organic G4'],
        ['Ploiesti (nord)', '9134172858', 'InterBlock', 'Terminal Live', 'Organic G4']
      ];
    }

    return [];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
