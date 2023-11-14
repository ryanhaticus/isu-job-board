import mongoose from 'mongoose';

const mongoDBUrl = 'mongodb://mongo:Bfb13hfCCFDGfB2h4cEHfgBf2GD6HDH6@roundhouse.proxy.rlwy.net:37624';

let cached = global.globalMongoose;

if (!cached) {
  cached = global.globalMongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoDBUrl).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;