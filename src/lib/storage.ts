// LocalStorage utility for persisting analysis data

const STORAGE_KEYS = {
  ANALYSIS_OUTPUT: 'seo-analysis-output',
  CRAWL_DATA: 'seo-crawl-data',
  BASE_URL: 'seo-base-url',
  USER_PREFERENCES: 'seo-user-preferences'
} as const;

export const storage = {
  // Save analysis output
  saveAnalysisOutput: (data: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANALYSIS_OUTPUT, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to save analysis output:', error);
    }
  },

  // Get analysis output
  getAnalysisOutput: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANALYSIS_OUTPUT);
      if (!stored) return null;
      
      const { data, timestamp } = JSON.parse(stored);
      // Return null if data is older than 7 days
      const isExpired = Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000;
      return isExpired ? null : data;
    } catch (error) {
      console.error('Failed to get analysis output:', error);
      return null;
    }
  },

  // Save crawl data
  saveCrawlData: (baseUrl: string, pages: any[], runId: string, publicToken: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CRAWL_DATA, JSON.stringify({
        baseUrl,
        pages,
        runId,
        publicToken,
        timestamp: Date.now()
      }));
      localStorage.setItem(STORAGE_KEYS.BASE_URL, baseUrl);
    } catch (error) {
      console.error('Failed to save crawl data:', error);
    }
  },

  // Get crawl data
  getCrawlData: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CRAWL_DATA);
      if (!stored) return null;
      
      const { data, timestamp } = JSON.parse(stored);
      // Return null if data is older than 24 hours
      const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
      return isExpired ? null : data;
    } catch (error) {
      console.error('Failed to get crawl data:', error);
      return null;
    }
  },

  // Get last base URL
  getBaseUrl: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.BASE_URL) || '';
    } catch (error) {
      console.error('Failed to get base URL:', error);
      return '';
    }
  },

  // Save user preferences
  saveUserPreferences: (preferences: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  },

  // Get user preferences
  getUserPreferences: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return {};
    }
  },

  // Clear all data
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
};
