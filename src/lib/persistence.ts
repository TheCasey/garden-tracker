export interface PersistenceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function createBrowserPersistenceStorage(storage: Storage): PersistenceStorage {
  return {
    getItem: (key) => storage.getItem(key),
    setItem: (key, value) => storage.setItem(key, value),
    removeItem: (key) => storage.removeItem(key),
  };
}

export function createMemoryPersistenceStorage(
  seedEntries?: Iterable<readonly [string, string]>,
): PersistenceStorage {
  const storage = new Map<string, string>(seedEntries);

  return {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => {
      storage.set(key, value);
    },
    removeItem: (key) => {
      storage.delete(key);
    },
  };
}

export function readJsonFromStorage<T>(storage: PersistenceStorage, key: string): T | null {
  const rawValue = storage.getItem(key);

  if (rawValue === null) {
    return null;
  }

  return JSON.parse(rawValue) as T;
}

export function writeJsonToStorage<T>(storage: PersistenceStorage, key: string, value: T): void {
  storage.setItem(key, JSON.stringify(value));
}
