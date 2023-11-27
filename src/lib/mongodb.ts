import { createConnection } from 'mongoose';

export const db = createConnection(process.env.MONGO_URL!, {
  maxPoolSize: 10,
});
