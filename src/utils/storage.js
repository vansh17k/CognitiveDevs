/**
 * ============================================================================
 * LOCAL STORAGE PERSISTENCE MANAGER
 * ============================================================================
 * 
 * Manages reliable client-side caching of:
 * - Verified product repository
 * - Field inspection records
 * - Rule sets and amendments
 * - Authenticated officer sessions
 */

export const STORAGE_KEYS = {
  PRODUCTS: 'lmcc_products_v2',
  INSPECTIONS: 'lmcc_inspections_v2',
  RULES: 'lmcc_rules_v2',
  USERS: 'lmcc_users_v2',
  CURRENT_USER: 'lmcc_current_user_v2',
  SETTINGS: 'lmcc_settings_v2'
};

/**
 * Safely loads parsed JSON data from localStorage with a fallback default.
 * 
 * @param {string} key - Storage key name
 * @param {*} defaultValue - Fallback data if key is missing or corrupted
 * @returns {*} Loaded data
 */
export function getFromStorage(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[Suraksha1 Storage] Failed to read key: "${key}"`, error);
    return defaultValue;
  }
}

/**
 * Safely serializes and persists data to localStorage.
 * 
 * @param {string} key - Storage key name
 * @param {*} value - Value to serialize
 * @returns {boolean} Success status
 */
export function saveToStorage(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[Suraksha1 Storage] Failed to write key: "${key}"`, error);
    return false;
  }
}

/**
 * Removes an item from localStorage.
 * 
 * @param {string} key - Storage key name
 */
export function removeFromStorage(key) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[Suraksha1 Storage] Failed to remove key: "${key}"`, error);
  }
}
