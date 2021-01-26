import database from '@/db';

const payeeRepository = {
  async bulkAdd(payees) {
    const db = await database.getClient();
    await db.payee.bulkAdd(payees);
  },
  async truncate() {
    const db = await database.getClient();
    await db.payee.clear();
  },
  async getAll() {
    const db = await database.getClient();
    return db.payee.orderBy('id').toArray();
  },
};

export {
  payeeRepository,
};
