import { generateFromEmail } from 'unique-username-generator';
import IUser from '../../../interfaces/users/user-interface';
import * as emailService from '../../../services/email-service';
import { signup } from '../../../services/signup-service';
import * as userService from '../../../services/user-service';
import bcrypt from 'bcrypt';
import ApiError from '../../../utils/api-error';

// important
jest.mock('bcrypt');
jest.mock('unique-username-generator');

let signupRequest: any = {
  email: 'test@example.com',
  password: '12345678',
  role: 'interviewee',
};

beforeAll(async () => {});
afterAll(async () => {});

describe('signup-service', () => {
  describe('valid signup request with unique email', () => {
    it('should send signup response', async () => {
      const expectedResponse: any = {
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'interviewee',
      };

      // mock
      jest.spyOn(userService, 'getByEmailOrDefault').mockResolvedValueOnce(null);
      jest.spyOn(emailService, 'sendEmailConfirmation').mockImplementation(async (email: string) => {});
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      jest.spyOn(userService, 'existsByUsername').mockResolvedValueOnce(false);
      jest.spyOn(userService, 'save').mockResolvedValueOnce(expectedResponse);

      const signupResponse: IUser = await signup(signupRequest);
      expect(signupResponse).toBe(expectedResponse);
    });
  });

  describe('already signed up user but with no confirmed email', () => {
    it(`should throw ApiError.badRequest('This email is already signed up, check your email for confirmation')`, async () => {
      // mock
      jest
        .spyOn(userService, 'getByEmailOrDefault')
        .mockResolvedValueOnce({ ...signupRequest, confirmed: false } as any);
      jest.spyOn(emailService, 'sendEmailConfirmation').mockImplementation(async (email: string) => {});

      await expect(signup(signupRequest)).rejects.toThrow(
        ApiError.badRequest('This email is already signed up, check your email for confirmation')
      );
    });
  });

  describe('already signed up user and the email is confirmed', () => {
    it(`should throw ApiError.badRequest('This email is already taken, choose another one')`, async () => {
      // mock
      jest
        .spyOn(userService, 'getByEmailOrDefault')
        .mockResolvedValueOnce({ ...signupRequest, confirmed: true } as any);

      await expect(signup(signupRequest)).rejects.toThrow(
        ApiError.badRequest('This email is already taken, choose another one')
      );
    });
  });
});
