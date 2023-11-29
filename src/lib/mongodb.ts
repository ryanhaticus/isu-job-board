import mongoose, { Connection } from 'mongoose';

let dbConnection: Connection;

export const connectToDatabase = async () => {

  if (dbConnection && dbConnection.readyState === 1) {
    return dbConnection;
  }

  dbConnection = mongoose.createConnection(process.env.MONGO_URL!, {
    maxPoolSize: 10,
    dbName: 'isu-job-board',
  });

  return dbConnection;
};
