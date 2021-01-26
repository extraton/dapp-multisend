import Dexie from "dexie";

const DB_NAME = 'db1';

const _ = {
  setSchema: function (db) {
    db.version(1).stores({
      payee: '++id, address, amount',
    });
  },
};

export default {
  getClient: async function () {
    const db = new Dexie(DB_NAME);
    _.setSchema(db);
    await db.open();
    return db;
  },
};
