/**
 * Lokale persistentie van de demo-database.
 *
 * IndexedDB heeft ruim voldoende quota voor foto's (als data-URL). Valt terug op
 * localStorage als IndexedDB niet beschikbaar is (bv. sommige privévensters).
 * Vervang deze module door API-calls zodra er een echte backend is.
 */

import type { DatabaseState } from "@/lib/types";

const DB_NAME = "assiette";
const STORE = "state";
const KEY = "database-v1";
const LS_KEY = "assiette.database-v1";
const SESSION_KEY = "assiette.session";

function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB niet beschikbaar"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadDatabase(): Promise<DatabaseState | null> {
  try {
    const idb = await openIdb();
    return await new Promise<DatabaseState | null>((resolve, reject) => {
      const tx = idb.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve((req.result as DatabaseState | undefined) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as DatabaseState) : null;
    } catch {
      return null;
    }
  }
}

export async function saveDatabase(state: DatabaseState): Promise<void> {
  try {
    const idb = await openIdb();
    await new Promise<void>((resolve, reject) => {
      const tx = idb.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(state, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }
}

export const sessionStore = {
  get(): string | null {
    try {
      return localStorage.getItem(SESSION_KEY);
    } catch {
      return null;
    }
  },
  set(userId: string | null) {
    try {
      if (userId) localStorage.setItem(SESSION_KEY, userId);
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* privémodus: sessie blijft alleen in geheugen */
    }
  },
};

/** Kleine, per-recept voorkeuren (afgevinkte ingrediënten, porties). */
export function readPreference<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`assiette.pref.${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writePreference<T>(key: string, value: T) {
  try {
    localStorage.setItem(`assiette.pref.${key}`, JSON.stringify(value));
  } catch {
    /* negeren */
  }
}
