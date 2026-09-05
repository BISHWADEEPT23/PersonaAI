import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PersonaDB extends DBSchema {
  'offline-entries': {
    key: string;
    value: {
      id: string;
      uid: string;
      inputText: string;
      mood: string | null;
      imageFile: Blob | null;
      audioFile: Blob | null;
      latitude: number | null;
      longitude: number | null;
      source: string | null;
      createdAt: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<PersonaDB>> | null = null;

export const getDB = () => {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<PersonaDB>('persona-ai', 1, {
      upgrade(db) {
        db.createObjectStore('offline-entries', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
};

export const saveOfflineEntry = async (entry: PersonaDB['offline-entries']['value']) => {
  const db = await getDB();
  if (!db) return;
  await db.put('offline-entries', entry);
};

export const getOfflineEntries = async (uid: string) => {
  const db = await getDB();
  if (!db) return [];
  const all = await db.getAll('offline-entries');
  return all.filter((entry) => entry.uid === uid).sort((a, b) => b.createdAt - a.createdAt);
};

export const deleteOfflineEntry = async (id: string) => {
  const db = await getDB();
  if (!db) return;
  await db.delete('offline-entries', id);
};
