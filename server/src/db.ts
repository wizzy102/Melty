import mongoose from 'mongoose';
import { env } from './config/env.js';

// NoSQL-injection note: every value that reaches a query is first parsed by a
// zod schema into a primitive (IDs must be 24-hex strings, etc.), so request
// bodies/params can never smuggle `$` operator objects into a filter.
mongoose.set('strictQuery', true);

export async function connectDb(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB,
    serverSelectionTimeoutMS: 10_000,
  });
  console.log(`[db] connected to "${env.MONGODB_DB}"`);
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
