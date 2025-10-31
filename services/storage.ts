import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  TODOS: '@mystudymate_todos',
  NOTES: '@mystudymate_notes',
  DREAMS: '@mystudymate_dreams',
  TIMER_STATS: '@mystudymate_timer_stats',
  THEME: '@mystudymate_theme',
  USER: '@mystudymate_user',
};

// Generic storage functions
export const saveData = async (key: string, data: any): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    return false;
  }
};

export const loadData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return null;
  }
};

export const deleteData = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error deleting data for key ${key}:`, error);
    return false;
  }
};

export const clearAllData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

// Specific storage functions for each feature
export const saveTodos = (todos: any[]) => saveData(STORAGE_KEYS.TODOS, todos);
export const loadTodos = () => loadData<any[]>(STORAGE_KEYS.TODOS);

export const saveNotes = (notes: any[]) => saveData(STORAGE_KEYS.NOTES, notes);
export const loadNotes = () => loadData<any[]>(STORAGE_KEYS.NOTES);

export const saveDreams = (dreams: any[]) => saveData(STORAGE_KEYS.DREAMS, dreams);
export const loadDreams = () => loadData<any[]>(STORAGE_KEYS.DREAMS);

export const saveTimerStats = (stats: any) => saveData(STORAGE_KEYS.TIMER_STATS, stats);
export const loadTimerStats = () => loadData<any>(STORAGE_KEYS.TIMER_STATS);
