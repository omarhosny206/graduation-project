import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export async function createMongoMemoryServer() {
  try {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
    }
    return mongoServer;
  } catch (error) {
    console.log('Error Happened');
  }
}
