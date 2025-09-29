import { getGoogleSheetsData, updateGoogleSheetsData, appendGoogleSheetsData, convertSheetsDataToObjects, convertObjectsToSheetsData } from '../config/googleSheets';
import { getCollection } from '../config/database';

// Google Sheets configuration for Users
const USERS_SHEET_RANGE = 'Users!A:H'; // Adjust range based on your sheet structure
const USERS_HEADERS = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'avatar'];

export const UserAPI = {
  // Get all users from Google Sheets
  async list() {
    try {
      const data = await getGoogleSheetsData(USERS_SHEET_RANGE);
      const users = convertSheetsDataToObjects(data.slice(1), USERS_HEADERS); // Skip header row
      
      // Also sync to MongoDB for better performance
      await this.syncToMongoDB(users);
      
      return users;
    } catch (error) {
      console.error('Error fetching users from Google Sheets:', error);
      // Fallback to MongoDB if Google Sheets fails
      return await this.listFromMongoDB();
    }
  },

  // Get users from MongoDB (fallback)
  async listFromMongoDB() {
    try {
      const collection = await getCollection('users');
      const users = await collection.find({}).toArray();
      return users;
    } catch (error) {
      console.error('Error fetching users from MongoDB:', error);
      return [];
    }
  },

  // Create a new user
  async create(userData) {
    try {
      // Generate unique ID
      const id = Date.now().toString();
      const newUser = {
        id,
        ...userData,
        created_date: new Date().toISOString(),
        is_active: userData.is_active !== false
      };

      // Add to Google Sheets
      const rowData = convertObjectsToSheetsData([newUser], USERS_HEADERS);
      await appendGoogleSheetsData(USERS_SHEET_RANGE.replace('!A:H', ''), rowData);

      // Also save to MongoDB
      await this.saveToMongoDB(newUser);

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update an existing user
  async update(id, userData) {
    try {
      // First get current users to find the row index
      const users = await this.list();
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user data
      const updatedUser = {
        ...users[userIndex],
        ...userData,
        updated_date: new Date().toISOString()
      };

      // Update in Google Sheets (this requires finding the correct row)
      // For simplicity, we'll update the entire sheet
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      
      const sheetData = [USERS_HEADERS, ...convertObjectsToSheetsData(updatedUsers, USERS_HEADERS)];
      await updateGoogleSheetsData(USERS_SHEET_RANGE.replace('!A:H', ''), sheetData);

      // Also update MongoDB
      await this.updateInMongoDB(id, updatedUser);

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Get a single user by ID
  async get(id) {
    try {
      const users = await this.list();
      return users.find(user => user.id === id) || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Sync data from Google Sheets to MongoDB
  async syncToMongoDB(users) {
    try {
      const collection = await getCollection('users');
      
      // Clear existing data and insert new data
      await collection.deleteMany({});
      if (users.length > 0) {
        await collection.insertMany(users);
      }
    } catch (error) {
      console.error('Error syncing to MongoDB:', error);
    }
  },

  // Save user to MongoDB
  async saveToMongoDB(user) {
    try {
      const collection = await getCollection('users');
      await collection.insertOne(user);
    } catch (error) {
      console.error('Error saving user to MongoDB:', error);
    }
  },

  // Update user in MongoDB
  async updateInMongoDB(id, userData) {
    try {
      const collection = await getCollection('users');
      await collection.updateOne({ id }, { $set: userData });
    } catch (error) {
      console.error('Error updating user in MongoDB:', error);
    }
  },

  // Delete user (optional - implement if needed)
  async delete(id) {
    try {
      const users = await this.list();
      const filteredUsers = users.filter(user => user.id !== id);
      
      // Update Google Sheets
      const sheetData = [USERS_HEADERS, ...convertObjectsToSheetsData(filteredUsers, USERS_HEADERS)];
      await updateGoogleSheetsData(USERS_SHEET_RANGE.replace('!A:H', ''), sheetData);

      // Also delete from MongoDB
      const collection = await getCollection('users');
      await collection.deleteOne({ id });

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

export default UserAPI;

