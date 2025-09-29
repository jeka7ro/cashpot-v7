import { getGoogleSheetsData, convertSheetsDataToObjects } from '../config/googleSheets.js';
import { getCollection } from '../config/database.js';

// Configuration for different data types
const DATA_CONFIGS = {
  users: {
    sheetRange: 'Users!A:H',
    headers: ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'avatar'],
    collectionName: 'users'
  },
  companies: {
    sheetRange: 'Companies!A:J',
    headers: ['id', 'name', 'registration_number', 'tax_id', 'address', 'phone', 'email', 'contact_person', 'status', 'created_date'],
    collectionName: 'companies'
  },
  locations: {
    sheetRange: 'Locations!A:G',
    headers: ['id', 'name', 'address', 'company_id', 'phone', 'email', 'created_date'],
    collectionName: 'locations'
  },
  providers: {
    sheetRange: 'Providers!A:F',
    headers: ['id', 'name', 'contact_person', 'phone', 'email', 'created_date'],
    collectionName: 'providers'
  },
  cabinets: {
    sheetRange: 'Cabinets!A:H',
    headers: ['id', 'name', 'location_id', 'status', 'manufacturer', 'model', 'serial_number', 'created_date'],
    collectionName: 'cabinets'
  },
  slotmachines: {
    sheetRange: 'SlotMachines!A:L',
    headers: ['id', 'serial_number', 'manufacturer', 'model', 'location_id', 'cabinet_id', 'game_mix_id', 'rtp', 'status', 'purchase_date', 'last_maintenance', 'created_date'],
    collectionName: 'slotmachines'
  },
  gamemixes: {
    sheetRange: 'GameMixes!A:F',
    headers: ['id', 'name', 'provider_id', 'rtp', 'volatility', 'created_date'],
    collectionName: 'gamemixes'
  }
};

export async function syncAllData() {
  console.log('Starting data synchronization from Google Sheets to MongoDB...');
  
  for (const [dataType, config] of Object.entries(DATA_CONFIGS)) {
    try {
      console.log(`Syncing ${dataType}...`);
      await syncDataType(dataType, config);
      console.log(`✅ ${dataType} synced successfully`);
    } catch (error) {
      console.error(`❌ Error syncing ${dataType}:`, error);
    }
  }
  
  console.log('Data synchronization completed!');
}

async function syncDataType(dataType, config) {
  try {
    // Get data from Google Sheets
    const sheetData = await getGoogleSheetsData(config.sheetRange);
    const objects = convertSheetsDataToObjects(sheetData.slice(1), config.headers); // Skip header row
    
    // Get MongoDB collection
    const collection = await getCollection(config.collectionName);
    
    // Clear existing data
    await collection.deleteMany({});
    
    // Insert new data
    if (objects.length > 0) {
      await collection.insertMany(objects);
    }
    
    console.log(`Synced ${objects.length} ${dataType} records`);
  } catch (error) {
    console.error(`Error syncing ${dataType}:`, error);
    throw error;
  }
}

export async function syncUsers() {
  return syncDataType('users', DATA_CONFIGS.users);
}

export async function syncCompanies() {
  return syncDataType('companies', DATA_CONFIGS.companies);
}

export async function syncLocations() {
  return syncDataType('locations', DATA_CONFIGS.locations);
}

export async function syncProviders() {
  return syncDataType('providers', DATA_CONFIGS.providers);
}

export async function syncCabinets() {
  return syncDataType('cabinets', DATA_CONFIGS.cabinets);
}

export async function syncSlotMachines() {
  return syncDataType('slotmachines', DATA_CONFIGS.slotmachines);
}

export async function syncGameMixes() {
  return syncDataType('gamemixes', DATA_CONFIGS.gamemixes);
}

// Run sync if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncAllData().catch(console.error);
}

