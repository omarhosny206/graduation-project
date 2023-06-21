import UserModel from '../../../models/user-model';
import {
  getAll,
  getByEmail,
  update,
  updatePrice,
  updateSkills,
  updateUsername,
  updateRole,
} from '../../../services/user-service';
import * as userService from '../../../services/user-service';
import ApiError from '../../../utils/api-error';

// important
jest.mock('../../../models/user-model.ts');

const users: any[] = [
  {
    email: 'omar@gmail.com',
    password: 'hashed-password',
    username: 'omar102',
    role: 'interviewee',
    info: {
      firstName: 'omar',
      lastName: 'hosny',
      priceable: true,
    },
  },
  { email: 'mohammed@gmail.com', password: 'hashed-password', role: 'interviewer' },
  { email: 'dola@gmail.com', password: 'hashed-password' },
  { email: 'oss@gmail.com', password: 'hashed-password' },
];

beforeAll(async () => {});
afterAll(async () => {});

describe('user-service', () => {
  describe('get all users', () => {
    it('should send all users', async () => {
      // mock
      (UserModel.find as jest.Mock).mockResolvedValue(users);

      const allUsers = await getAll();
      expect(allUsers).toBe(users);
    });
  });

  describe('get by email', () => {
    describe('existing user', () => {
      it('should send the user', async () => {
        // mock
        (UserModel.findOne as jest.Mock).mockResolvedValue(users[0]);

        const user = await getByEmail(users[0].email);
        expect(user).toBe(users[0]);
      });
    });

    describe('non existing user', () => {
      it(`should throw ApiError.badRequest('user not found with this email');`, async () => {
        // mock
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);

        await expect(getByEmail(users[0].email)).rejects.toThrow(ApiError.badRequest('user not found with this email'));
      });
    });
  });

  describe('update user info', () => {
    describe('with prior info', () => {
      it('should send the updated user', async () => {
        const userInfo: any = { bio: "hello i'm omar hosny", levelOfExperience: 'senior' };
        const storedUser = {
          ...users[0],
          save: jest.fn().mockResolvedValueOnce({
            ...users[0],
            info: { ...users[0].info, ...userInfo },
          }),
        };

        const user = await update(storedUser, userInfo);
        expect(user.info).toEqual({ ...users[0].info, ...userInfo });
      });
    });

    describe('with no prior info', () => {
      it('should send the updated user', async () => {
        const userInfo: any = { firstName: 'mohammed', lastName: 'elfar' };
        const storedUser = {
          ...users[1],
          save: jest.fn().mockResolvedValueOnce({
            ...users[1],
            info: { ...users[1].info, ...userInfo },
          }),
        };

        const user = await update(storedUser, userInfo);
        expect(user.info).toEqual(userInfo);
      });
    });
  });

  describe('update user skills', () => {
    describe('with prior info and with/without prior skills', () => {
      it('should send the updated user', async () => {
        const userInfo: any = { skills: ['DSA', 'System Design', 'Java'] };
        const storedUser = {
          ...users[0],
          save: jest.fn().mockResolvedValueOnce({
            ...users[0],
            info: { ...users[0].info, ...userInfo },
          }),
        };

        const user = await updateSkills(storedUser, userInfo);
        expect(user.info).toEqual({ ...users[0].info, ...userInfo });
      });
    });

    describe('with no prior info', () => {
      it(`should throw ApiError.badRequest('User info is required')`, async () => {
        const userInfo: any = { skills: ['DSA', 'System Design', 'Java'] };
        const storedUser = {
          ...users[1],
          save: jest.fn().mockResolvedValueOnce({
            ...users[1],
            info: { ...users[1].info, ...userInfo },
          }),
        };

        await expect(updateSkills(storedUser, userInfo)).rejects.toThrow(ApiError.badRequest('User info is required'));
      });
    });
  });

  describe('update price', () => {
    describe('with prior info and priceable', () => {
      it('should send the updated user', async () => {
        const userInfo: any = { price: 30 };
        const storedUser = {
          ...users[0],
          save: jest.fn().mockResolvedValueOnce({
            ...users[0],
            info: { ...users[0].info, ...userInfo },
          }),
        };

        const user = await updatePrice(storedUser, userInfo);
        expect(user.info).toEqual({ ...users[0].info, ...userInfo });
      });
    });

    describe('with prior info and not priceable but eligible for pricing', () => {
      it('should send the updated user', async () => {
        const userInfo: any = { price: 20 };
        const storedUser = {
          ...users[0],
          info: { ...users[0].info, priceable: false },
          save: jest.fn().mockResolvedValueOnce({
            ...users[0],
            info: { ...users[0].info, ...userInfo },
          }),
        };

        // mock
        jest.spyOn(userService, 'isIllegibleForPricing').mockResolvedValue(true);

        const user = await updatePrice(storedUser, userInfo);
        expect(user.info).toEqual({ ...users[0].info, ...userInfo });
      });
    });

    describe('with prior info and not priceable but not eligible for pricing', () => {
      it(`should throw ApiError.badRequest('Cannot update price, user is not illegible for pricing')`, async () => {
        const userInfo: any = { price: 20 };
        const storedUser = {
          ...users[0],
          info: { ...users[0].info, priceable: false },
          save: jest.fn().mockResolvedValueOnce({
            ...users[0],
            info: { ...users[0].info, ...userInfo },
          }),
        };

        // mock
        jest.spyOn(userService, 'isIllegibleForPricing').mockResolvedValue(false);

        await expect(updatePrice(storedUser, userInfo)).rejects.toThrow(
          ApiError.badRequest('Cannot update price, user is not illegible for pricing')
        );
      });
    });

    describe('with no prior info', () => {
      it(`should throw ApiError.badRequest('User info is required')`, async () => {
        const userInfo: any = { price: 30 };
        const storedUser = {
          ...users[1],
          save: jest.fn().mockResolvedValueOnce({
            ...users[1],
            info: { ...users[1].info, ...userInfo },
          }),
        };

        await expect(updatePrice(storedUser, userInfo)).rejects.toThrow(ApiError.badRequest('User info is required'));
      });
    });
  });

  describe('update username', () => {
    describe('entered same username', () => {
      it('should send the same user without processing', async () => {
        const username = users[0].username;

        const storedUser = {
          ...users[0],
        };

        const user = await updateUsername(storedUser, username);
        expect(user).toEqual(users[0]);
      });
    });

    describe('entered not used username', () => {
      it('should send the updated user', async () => {
        const username = 'omarhosny102';

        const storedUser = {
          ...users[0],
          save: jest.fn().mockResolvedValueOnce({
            ...users[0],
            username: username,
          }),
        };

        // mock
        jest.spyOn(userService, 'existsByUsername').mockResolvedValue(false);

        const user = await updateUsername(storedUser, username);
        expect(user.username).toEqual(username);
      });
    });

    describe('entered used username', () => {
      it(`should throw ApiError.badRequest('username is already used')`, async () => {
        const username = 'omarhosny102';

        const storedUser = {
          ...users[0],
          save: jest.fn().mockResolvedValueOnce({
            ...users[0],
            username: username,
          }),
        };

        // mock
        jest.spyOn(userService, 'existsByUsername').mockResolvedValue(true);

        await expect(updateUsername(storedUser, username)).rejects.toThrow(
          ApiError.badRequest('username is already used')
        );
      });
    });
  });

  describe('update role', () => {
    describe('interviewee', () => {
      it('should send the updated user', async () => {
        const storedUser = {
          ...users[0],
          save: jest.fn().mockResolvedValueOnce({
            ...users[0],
            role: 'interviewer',
          }),
        };

        const user = await updateRole(storedUser);
        expect(user.role).toEqual('interviewer');
      });
    });

    describe('interviewer', () => {
      it(`should throw ApiError.badRequest('Interviewer cannot update role')`, async () => {
        const storedUser = {
          ...users[1],
        };

        await expect(updateRole(storedUser)).rejects.toThrow(ApiError.badRequest('Interviewer cannot update role'));
      });
    });
  });
});
