const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'messmate_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db = {
  users: [],
  messes: [],
  membershipPlans: [],
  membershipRecords: [],
  mealMenus: [],
  mealSkipRecords: [],
  wallets: [],
  walletTransactions: [],
  payments: [],
  inventoryItems: [],
  purchaseRecords: [],
  foodWasteRecords: [],
  complaintFeedback: [],
  notifications: []
};

// Load existing data from file if available
function loadDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      db = { ...db, ...parsed };
      console.log('📦 [DataStore] Persistent local database loaded successfully.');
    } catch (err) {
      console.error('⚠️ [DataStore] Error loading DB file, initializing fresh:', err.message);
    }
  }
}

// Save data to file
function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('⚠️ [DataStore] Error saving DB file:', err.message);
  }
}

// Generate unique ID
function generateId() {
  return 'mm_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Helper to match Mongo-like query filters
function matchesQuery(item, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, value] of Object.entries(query)) {
    if (key === '_id' || key === 'id') {
      const itemId = item._id || item.id;
      if (itemId !== value && String(itemId) !== String(value)) return false;
      continue;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if ('$in' in value) {
        if (!value.$in.includes(item[key])) return false;
      } else if ('$ne' in value) {
        if (item[key] === value.$ne) return false;
      } else if ('$gte' in value) {
        if (!(item[key] >= value.$gte)) return false;
      } else if ('$lte' in value) {
        if (!(item[key] <= value.$lte)) return false;
      } else if ('$regex' in value) {
        const regex = new RegExp(value.$regex, value.$options || 'i');
        if (!regex.test(item[key] || '')) return false;
      }
    } else {
      if (item[key] !== value && String(item[key]) !== String(value)) {
        return false;
      }
    }
  }
  return true;
}

// Create a collection wrapper that mimics Mongoose model methods
function createCollection(collectionName) {
  if (!db[collectionName]) {
    db[collectionName] = [];
  }

  return {
    name: collectionName,
    async find(query = {}) {
      const items = db[collectionName].filter(item => matchesQuery(item, query));
      // Return a copy so caller can manipulate
      return items.map(i => ({ ...i }));
    },
    async findOne(query = {}) {
      const item = db[collectionName].find(item => matchesQuery(item, query));
      return item ? { ...item } : null;
    },
    async findById(id) {
      if (!id) return null;
      const item = db[collectionName].find(item => (item._id === id || item.id === id || String(item._id) === String(id)));
      return item ? { ...item } : null;
    },
    async create(doc) {
      const newDoc = {
        _id: doc._id || generateId(),
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...doc
      };
      db[collectionName].push(newDoc);
      saveDb();
      return { ...newDoc };
    },
    async insertMany(docs) {
      const created = docs.map(doc => ({
        _id: doc._id || generateId(),
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...doc
      }));
      db[collectionName].push(...created);
      saveDb();
      return created.map(d => ({ ...d }));
    },
    async findByIdAndUpdate(id, update, options = { new: true }) {
      const index = db[collectionName].findIndex(item => (item._id === id || item.id === id || String(item._id) === String(id)));
      if (index === -1) return null;

      const current = db[collectionName][index];
      const updated = {
        ...current,
        ...(update.$set || update),
        updatedAt: new Date().toISOString()
      };

      if (update.$inc) {
        for (const [key, incVal] of Object.entries(update.$inc)) {
          updated[key] = (Number(updated[key]) || 0) + Number(incVal);
        }
      }

      db[collectionName][index] = updated;
      saveDb();
      return { ...updated };
    },
    async updateOne(query, update) {
      const index = db[collectionName].findIndex(item => matchesQuery(item, query));
      if (index === -1) return { matchedCount: 0, modifiedCount: 0 };

      const current = db[collectionName][index];
      const updated = {
        ...current,
        ...(update.$set || update),
        updatedAt: new Date().toISOString()
      };

      if (update.$inc) {
        for (const [key, incVal] of Object.entries(update.$inc)) {
          updated[key] = (Number(updated[key]) || 0) + Number(incVal);
        }
      }

      db[collectionName][index] = updated;
      saveDb();
      return { matchedCount: 1, modifiedCount: 1, item: { ...updated } };
    },
    async updateMany(query, update) {
      let count = 0;
      db[collectionName] = db[collectionName].map(item => {
        if (matchesQuery(item, query)) {
          count++;
          const updated = {
            ...item,
            ...(update.$set || update),
            updatedAt: new Date().toISOString()
          };
          if (update.$inc) {
            for (const [key, incVal] of Object.entries(update.$inc)) {
              updated[key] = (Number(updated[key]) || 0) + Number(incVal);
            }
          }
          return updated;
        }
        return item;
      });
      saveDb();
      return { matchedCount: count, modifiedCount: count };
    },
    async deleteOne(query) {
      const index = db[collectionName].findIndex(item => matchesQuery(item, query));
      if (index === -1) return { deletedCount: 0 };
      db[collectionName].splice(index, 1);
      saveDb();
      return { deletedCount: 1 };
    },
    async deleteMany(query) {
      const initialLen = db[collectionName].length;
      db[collectionName] = db[collectionName].filter(item => !matchesQuery(item, query));
      const deletedCount = initialLen - db[collectionName].length;
      saveDb();
      return { deletedCount };
    },
    async countDocuments(query = {}) {
      return db[collectionName].filter(item => matchesQuery(item, query)).length;
    },
    raw() {
      return db[collectionName];
    },
    clear() {
      db[collectionName] = [];
      saveDb();
    }
  };
}

// Initial load
loadDb();

module.exports = {
  db,
  saveDb,
  loadDb,
  generateId,
  createCollection,
  // Collections
  Users: createCollection('users'),
  Messes: createCollection('messes'),
  MembershipPlans: createCollection('membershipPlans'),
  MembershipRecords: createCollection('membershipRecords'),
  MealMenus: createCollection('mealMenus'),
  MealSkipRecords: createCollection('mealSkipRecords'),
  Wallets: createCollection('wallets'),
  WalletTransactions: createCollection('walletTransactions'),
  Payments: createCollection('payments'),
  InventoryItems: createCollection('inventoryItems'),
  PurchaseRecords: createCollection('purchaseRecords'),
  FoodWasteRecords: createCollection('foodWasteRecords'),
  ComplaintFeedback: createCollection('complaintFeedback'),
  Notifications: createCollection('notifications')
};
