import fs from 'fs';
import path from 'path';

// File-based data store for development
// Production can swap to Supabase by replacing these methods

const DATA_DIR = path.join(process.cwd(), 'data');

function getFilePath(entity) {
  return path.join(DATA_DIR, `${entity}.json`);
}

function readData(entity) {
  try {
    const filePath = getFilePath(entity);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${entity} data:`, error.message);
    return [];
  }
}

function writeData(entity, data) {
  try {
    const filePath = getFilePath(entity);
    // Ensure directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${entity} data:`, error.message);
    return false;
  }
}

// Predictions API
export const predictionsStore = {
  getAll() {
    return readData('predictions');
  },

  getById(id) {
    const all = this.getAll();
    return all.find(p => p.id === id);
  },

  create(prediction) {
    const all = this.getAll();
    const newPred = {
      ...prediction,
      id: `pred_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      resolved: false,
      verdict: null,
      accuracy: null,
    };
    all.push(newPred);
    writeData('predictions', all);
    return newPred;
  },

  update(id, updates) {
    const all = this.getAll();
    const idx = all.findIndex(p => p.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    writeData('predictions', all);
    return all[idx];
  },

  delete(id) {
    const all = this.getAll();
    const filtered = all.filter(p => p.id !== id);
    writeData('predictions', filtered);
    return true;
  },

  getActive() {
    const all = this.getAll();
    return all.filter(p => p.status === 'active' && !p.resolved);
  },

  getResolved() {
    const all = this.getAll();
    return all.filter(p => p.resolved);
  },
};

// Creators API
export const creatorsStore = {
  getAll() {
    return readData('creators');
  },

  getById(id) {
    const all = this.getAll();
    return all.find(c => c.id === id);
  },

  create(creator) {
    const all = this.getAll();
    const newCreator = {
      ...creator,
      id: `creator_${Date.now()}`,
      credibilityScore: 0.5,
      accuracy: 0.5,
      consistency: 0.5,
      convictionCalibration: 0.5,
      behavioralAuthenticity: 0.5,
      fearMongeringIndex: 0.3,
      recentAnalyses: 0,
      lastAnalyzedAt: null,
    };
    all.push(newCreator);
    writeData('creators', all);
    return newCreator;
  },

  update(id, updates) {
    const all = this.getAll();
    const idx = all.findIndex(c => c.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    writeData('creators', all);
    return all[idx];
  },

  delete(id) {
    const all = this.getAll();
    const filtered = all.filter(c => c.id !== id);
    writeData('creators', filtered);
    return true;
  },

  getByPlatform(platform) {
    const all = this.getAll();
    return all.filter(c => c.platform === platform);
  },

  getTopCreators(limit = 10) {
    const all = this.getAll();
    return all.sort((a, b) => b.credibilityScore - a.credibilityScore).slice(0, limit);
  },
};

// Market Data API
export const marketDataStore = {
  getAll() {
    return readData('market-data');
  },

  getBySeries(series) {
    const all = this.getAll();
    return all.find(m => m.series === series);
  },

  create(marketData) {
    const all = this.getAll();
    const newData = {
      ...marketData,
      id: `fred_${marketData.series || Date.now()}`,
      lastUpdate: new Date().toISOString(),
    };
    all.push(newData);
    writeData('market-data', all);
    return newData;
  },

  update(id, updates) {
    const all = this.getAll();
    const idx = all.findIndex(m => m.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates, lastUpdate: new Date().toISOString() };
    writeData('market-data', all);
    return all[idx];
  },

  delete(id) {
    const all = this.getAll();
    const filtered = all.filter(m => m.id !== id);
    writeData('market-data', filtered);
    return true;
  },

  getLatest(series) {
    const market = this.getBySeries(series);
    if (!market || !market.data || market.data.length === 0) return null;
    return market.data[0]; // Assuming sorted by date descending
  },
};

// Content Feed API
export const contentFeedStore = {
  getAll() {
    return readData('content-feed');
  },

  getById(id) {
    const all = this.getAll();
    return all.find(c => c.id === id);
  },

  create(analysis) {
    const all = this.getAll();
    const newAnalysis = {
      ...analysis,
      id: `analysis_${Date.now()}`,
      analyzedAt: new Date().toISOString(),
    };
    all.push(newAnalysis);
    writeData('content-feed', all);
    return newAnalysis;
  },

  update(id, updates) {
    const all = this.getAll();
    const idx = all.findIndex(a => a.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    writeData('content-feed', all);
    return all[idx];
  },

  delete(id) {
    const all = this.getAll();
    const filtered = all.filter(a => a.id !== id);
    writeData('content-feed', filtered);
    return true;
  },

  getByCreator(creatorId) {
    const all = this.getAll();
    return all.filter(a => a.creatorId === creatorId);
  },

  getByVerdict(verdict) {
    const all = this.getAll();
    return all.filter(a => a.verdict === verdict);
  },

  getRecent(limit = 20) {
    const all = this.getAll();
    return all.sort((a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt)).slice(0, limit);
  },
};
