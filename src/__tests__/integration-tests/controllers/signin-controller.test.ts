import mongoose, { Types } from 'mongoose';
import request from 'supertest';

import ISigninRequest from '../../../interfaces/users/signin-request-interface';
import { createMongoMemoryServer } from '../../../utils/mongo-memory-server';
import { app } from '../../../utils/server';
import { saveUsers } from '../../dummy/users';

beforeAll(async () => {
  const mongoServer = await createMongoMemoryServer();
  mongoose.connect(mongoServer!!.getUri());
  await saveUsers();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('signin-controller', () => {
  describe('given valid credentials', () => {
    it('should send 200 OK', async () => {
      const signInRequest: ISigninRequest = {
        email: 'omaraws@gmail.com',
        password: 'test@testA1',
      };

      await request(app).post('/api/v1/signin').send(signInRequest).expect(200);
    });
  });

  describe('given invalid credentials', () => {
    it('should send 401 UNAUTHORIZED', async () => {
      const signInRequest: ISigninRequest = {
        email: 'omarhosny103@gmail.com',
        password: 'test@testA2',
      };
      await request(app).post('/api/v1/signin').send(signInRequest).expect(401);
    });
  });

  describe('given wrong email', () => {
    it('should send 400 BAD REQUEST', async () => {
      const signInRequest: ISigninRequest = {
        email: 'omarhosny102',
        password: '12345678',
      };
      await request(app).post('/api/v1/signin').send(signInRequest).expect(400);
    });
  });

  describe('given password less than 8 characters', () => {
    it('should send 400 BAD REQUEST', async () => {
      const signInRequest: ISigninRequest = {
        email: 'omarhosny102@gmail.com',
        password: 'tt@A1',
      };
      await request(app).post('/api/v1/signin').send(signInRequest).expect(400);
    });
  });
});
