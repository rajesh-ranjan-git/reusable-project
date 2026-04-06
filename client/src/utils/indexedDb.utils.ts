import { openDB } from "idb";

const dbPromise = openDB("sync-db", 1, {
  upgrade(db) {
    db.createObjectStore("requests", { autoIncrement: true });
  },
});

export const saveRequest = async (data: any) => {
  const db = await dbPromise;
  await db.add("requests", data);
};

export const getStoredRequests = async () => {
  const db = await dbPromise;
  return db.getAll("requests");
};

export const clearStoredRequests = async () => {
  const db = await dbPromise;
  await db.clear("requests");
};
