import mongoose from 'mongoose';
import request from 'supertest';

import { Role } from '../../../enums/role-enum';
import ISignupRequest from '../../../interfaces/users/signup-request-interface';
import { createMongoMemoryServer } from '../../../utils/mongo-memory-server';
import { app } from '../../../utils/server';
import { config } from 'dotenv';

config();

beforeAll(async () => {
  const mongoServer = await createMongoMemoryServer();
  mongoose.connect(mongoServer!!.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('signup-controller', () => {
  describe('given valid signup request', () => {
    it('should send 201 CREATED', async () => {
      const signupRequest: ISignupRequest = {
        email: 'omarhosny102@gmail.com',
        password: '12345678',
        role: Role.Interviewer,
      };

      await request(app).post('/api/v1/signup').send(signupRequest).expect(201);
    });
  });

  describe('given already used email', () => {
    it('should send 400 BAD REQUEST', async () => {
      const signupRequest: ISignupRequest = {
        email: 'omarhosny102@gmail.com',
        password: '12345678',
        role: Role.Interviewer,
      };

      await request(app).post('/api/v1/signup').send(signupRequest).expect(400);
    });
  });

  describe('given wrong email', () => {
    it('should send 400 BAD REQUEST', async () => {
      const signupRequest: ISignupRequest = {
        email: 'omarhosny102',
        password: '12345678',
        role: Role.Interviewer,
      };

      await request(app).post('/api/v1/signup').send(signupRequest).expect(400);
    });
  });

  describe('given password less than 8 characters', () => {
    it('should send 400 BAD REQUEST', async () => {
      const signupRequest: ISignupRequest = {
        email: 'omarhosny102@gmail.com',
        password: '1234567',
        role: Role.Interviewer,
      };

      await request(app).post('/api/v1/signup').send(signupRequest).expect(400);
    });
  });
});
