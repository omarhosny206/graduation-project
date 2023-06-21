import mongoose from 'mongoose';
import request from 'supertest';

import { LevelOfExperience } from '../../../enums/level-of-experience-enum';
import {
  generateAccessToken,
  generateEmailConfirmationToken,
  generateEmailUpdatingToken,
  generateResetPasswordToken,
} from '../../../utils/jwt';
import { createMongoMemoryServer } from '../../../utils/mongo-memory-server';
import { app } from '../../../utils/server';
import { saveUsers, users } from '../../dummy/users';
import { config } from 'dotenv';

config({ path: '../../../../.env' });

beforeAll(async () => {
  const mongoServer = await createMongoMemoryServer();
  mongoose.connect(mongoServer!!.getUri());
  await saveUsers();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('user-controller', () => {
  // GET
  describe('GET', () => {
    describe('get all users', () => {
      it('should send 200 OK', async () => {
        await request(app).get('/api/v1/users').expect(200);
      });
    });

    describe('get all fixed users', () => {
      it('should send 200 OK', async () => {
        await request(app).get('/api/v1/users/fixed').expect(200);
      });
    });

    describe('get profile of user', () => {
      describe('existing user', () => {
        it('should send 200 OK', async () => {
          await request(app).get('/api/v1/users/omarhosny102').expect(200);
        });
      });

      describe('non existing user', () => {
        it('should send 400 BAD REQUEST', async () => {
          await request(app).get('/api/v1/users/omarhosny').expect(400);
        });
      });
    });

    describe('get interviews had', () => {
      describe('interviewer', () => {
        it('should send 200 OK', async () => {
          const interviewerAccessToken = await generateAccessToken(users[0].email);
          await request(app)
            .get('/api/v1/users/interviews-had')
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(200);
        });
      });

      describe('interviewee', () => {
        it('should send 200 OK', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .get('/api/v1/users/interviews-had')
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(200);
        });
      });
    });

    describe('get interviews made', () => {
      describe('interviewer', () => {
        it('should send 200 OK', async () => {
          const interviewerAccessToken = await generateAccessToken(users[0].email);
          await request(app)
            .get('/api/v1/users/interviews-made')
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(200);
        });
      });

      describe('interviewee', () => {
        it('should send 403 FORBIDDEN', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .get('/api/v1/users/interviews-made')
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(403);
        });
      });
    });
  });

  // POST
  describe('POST', () => {
    describe('email confirmation', () => {
      describe('valid access token', () => {
        it('should send 200 OK', async () => {
          const emailConfirmationAccessToken = await generateEmailConfirmationToken(users[0].email);
          await request(app).post(`/api/v1/users/email/confirmation/${emailConfirmationAccessToken}`).expect(200);
        });
      });

      describe('invalid access token', () => {
        it('should send 401 UNAUTHORIZED', async () => {
          await request(app).post(`/api/v1/users/email/confirmation/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`).expect(401);
        });
      });
    });

    describe('forgot password', () => {
      describe('existing email', () => {
        it('should send 200 OK', async () => {
          await request(app)
            .post('/api/v1/users/forgot-password')
            .send({ email: 'softwarenotes1@gmail.com' })
            .expect(200);
        });
      });

      describe('non existing email', () => {
        it('should send 400 BAD REQUEST', async () => {
          await request(app).post('/api/v1/users/forgot-password').send({ email: 'software@gmail.com' }).expect(400);
        });
      });

      describe('wrong email', () => {
        it('should send 400 BAD REQUEST', async () => {
          await request(app).post('/api/v1/users/forgot-password').send({ email: 'software' }).expect(400);
        });
      });

      describe('empty email', () => {
        it('should send 400 BAD REQUEST', async () => {
          await request(app).post('/api/v1/users/forgot-password').send({ email: '' }).expect(400);
        });
      });

      describe('no email', () => {
        it('should send 400 BAD REQUEST', async () => {
          await request(app).post('/api/v1/users/forgot-password').send({}).expect(400);
        });
      });
    });

    describe('update email', () => {
      describe('non existing email', () => {
        it('should send 200 OK', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .post('/api/v1/users/email')
            .send({ email: 'ahmedhosnykeshk@gmail.com' })
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(200);
        });
      });

      describe('existing email', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .post('/api/v1/users/email')
            .send({ email: 'softwarenotes1@gmail.com' })
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });

      describe('empty email', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .post('/api/v1/users/email')
            .send({ email: '' })
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });

      describe('no email', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .post('/api/v1/users/email')
            .send({})
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });
    });
  });

  // PUT
  describe('PUT', () => {
    describe('update general info', () => {
      describe('valid update request', () => {
        it('should send 200 OK', async () => {
          const updateRequest = {
            firstName: 'omar',
            lastName: 'hosny',
            levelOfExperience: LevelOfExperience.Senior,
            bio: "Hey, i'm omar",
          };
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .put('/api/v1/users')
            .send(updateRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(200);
        });
      });

      describe('no first name', () => {
        it('should send 400 BAD REQUEST', async () => {
          const updateRequest = {
            lastName: 'hosny',
            levelOfExperience: LevelOfExperience.Senior,
            bio: "Hey, i'm omar",
          };
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .put('/api/v1/users')
            .send(updateRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });

      describe('no last name', () => {
        it('should send 400 BAD REQUEST', async () => {
          const updateRequest = {
            firstName: 'omar',
            levelOfExperience: LevelOfExperience.Senior,
            bio: "Hey, i'm omar",
          };
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .put('/api/v1/users')
            .send(updateRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });

      describe('wrong level of experience', () => {
        it('should send 400 BAD REQUEST', async () => {
          const updateRequest = {
            firstName: 'omar',
            lastName: 'hosny',
            levelOfExperience: 'Nothing',
            bio: "Hey, i'm omar",
          };
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .put('/api/v1/users')
            .send(updateRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });
    });

    describe('update skills', () => {
      describe('valid update request', () => {
        it('should send 200 OK', async () => {
          const updateRequest = {
            skills: ['Backend', 'Frontend'],
          };
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .put('/api/v1/users/skills')
            .send(updateRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(200);
        });
      });

      describe('empty skills', () => {
        it('should send 400 BAD REQUEST', async () => {
          const updateRequest = {
            skills: [],
          };
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .put('/api/v1/users/skills')
            .send(updateRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });

      describe('no skills', () => {
        it('should send 400 BAD REQUEST', async () => {
          const updateRequest = {};
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .put('/api/v1/users/skills')
            .send(updateRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });
    });

    describe('update socials', () => {
      describe('valid update request', () => {
        it('should send 200 OK', async () => {
          const updateRequest = {
            socials: {
              linkedin: 'linkedin',
              github: 'github',
              twitter: 'twitter',
            },
          };
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .put('/api/v1/users/socials')
            .send(updateRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(200);
        });
      });

      describe('empty socials', () => {
        it('should send 400 BAD REQUEST', async () => {
          const updateRequest = {
            socials: {},
          };
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .put('/api/v1/users/socials')
            .send(updateRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });

      describe('no socials', () => {
        it('should send 400 BAD REQUEST', async () => {
          const updateRequest = {};
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .put('/api/v1/users/socials')
            .send(updateRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });
    });

    describe('update username', () => {
      describe('non existing username', () => {
        it('should send 200 OK', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);

          await request(app)
            .put('/api/v1/users/username')
            .send({ username: 'ahmedhosnykeshk' })
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(200);
        });
      });

      describe('existing username', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);

          await request(app)
            .put('/api/v1/users/username')
            .send({ username: 'omarhosny102' })
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });

      describe('empty username', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);

          await request(app)
            .put('/api/v1/users/username')
            .send({ username: '' })
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });

      describe('no username', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);

          await request(app)
            .put('/api/v1/users/username')
            .send({})
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });
    });

    describe('update price', () => {
      describe('interviewer', () => {
        describe('priceable', () => {
          it('should send 200 OK', async () => {
            const interviewerAccessToken = await generateAccessToken(users[0].email);

            await request(app)
              .put('/api/v1/users/price')
              .send({ price: 20 })
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(200);
          });
        });

        describe('no user info', () => {
          it('should send 400 BAD REQUEST', async () => {
            const interviewerAccessToken2 = await generateAccessToken(users[1].email);

            await request(app)
              .put('/api/v1/users/price')
              .send({ price: 20 })
              .set('Authorization', `Bearer ${interviewerAccessToken2}`)
              .expect(400);
          });
        });

        describe('price less than 5', () => {
          it('should send 400 BAD REQUEST', async () => {
            const interviewerAccessToken2 = await generateAccessToken(users[1].email);

            await request(app)
              .put('/api/v1/users/price')
              .send({ price: 3 })
              .set('Authorization', `Bearer ${interviewerAccessToken2}`)
              .expect(400);
          });
        });

        describe('no price', () => {
          it('should send 400 BAD REQUEST', async () => {
            const interviewerAccessToken2 = await generateAccessToken(users[1].email);

            await request(app)
              .put('/api/v1/users/price')
              .send({})
              .set('Authorization', `Bearer ${interviewerAccessToken2}`)
              .expect(400);
          });
        });
      });

      describe('interviewee', () => {
        it('should send 403 FORBIDDEN', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);

          await request(app)
            .put('/api/v1/users/price')
            .send({ price: 20 })
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(403);
        });
      });
    });

    describe('update role', () => {
      describe('interviewee', () => {
        it('should send 200 OK', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);

          await request(app)
            .put('/api/v1/users/role')
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(200);
        });
      });

      describe('interviewer', () => {
        it('should send 403 FORBIDDEN', async () => {
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .put('/api/v1/users/role')
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(403);
        });
      });
    });

    describe('update price', () => {
      describe('interviewer', () => {
        describe('valid timeslots', () => {
          it('should send 200 OK', async () => {
            const interviewerAccessToken = await generateAccessToken(users[0].email);

            await request(app)
              .put('/api/v1/users/timeslots')
              .send({
                timeslots: [
                  {
                    day: 0,
                    hours: ['00:30'],
                  },
                  {
                    day: 1,
                    hours: ['00:00'],
                  },
                  {
                    day: 2,
                    hours: ['05:00'],
                  },
                  {
                    day: 3,
                    hours: ['09:30'],
                  },
                  {
                    day: 4,
                    hours: ['15:00'],
                  },
                  {
                    day: 5,
                    hours: ['10:00'],
                  },
                  {
                    day: 6,
                    hours: ['01:00'],
                  },
                ],
              })
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(200);
          });
        });

        describe('overlapped timeslots', () => {
          it('should send 400 BAD REQUEST', async () => {
            const interviewerAccessToken = await generateAccessToken(users[0].email);
            await request(app)
              .put('/api/v1/users/timeslots')
              .send({
                timeslots: [
                  {
                    day: 0,
                    hours: ['00:30', '23:30'],
                  },
                  {
                    day: 1,
                    hours: ['00:00'],
                  },
                  {
                    day: 2,
                    hours: ['05:00'],
                  },
                  {
                    day: 3,
                    hours: ['09:30'],
                  },
                  {
                    day: 4,
                    hours: ['15:00'],
                  },
                  {
                    day: 5,
                    hours: ['10:00'],
                  },
                  {
                    day: 6,
                    hours: ['01:00'],
                  },
                ],
              })
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });

        describe('no hours', () => {
          it('should send 400 BAD REQUEST', async () => {
            const interviewerAccessToken2 = await generateAccessToken(users[1].email);

            await request(app)
              .put('/api/v1/users/timeslots')
              .send({
                timeslots: [
                  {
                    day: 0,
                  },
                  {
                    day: 1,
                    hours: ['00:00'],
                  },
                  {
                    day: 2,
                    hours: ['05:00'],
                  },
                  {
                    day: 3,
                    hours: ['09:30'],
                  },
                  {
                    day: 4,
                    hours: ['15:00'],
                  },
                  {
                    day: 5,
                    hours: ['10:00'],
                  },
                  {
                    day: 6,
                    hours: ['01:00'],
                  },
                ],
              })
              .set('Authorization', `Bearer ${interviewerAccessToken2}`)
              .expect(400);
          });
        });

        describe('missing days', () => {
          it('should send 400 BAD REQUEST', async () => {
            const interviewerAccessToken2 = await generateAccessToken(users[1].email);

            await request(app)
              .put('/api/v1/users/timeslots')
              .send({
                timeslots: [
                  {
                    day: 5,
                    hours: ['10:00'],
                  },
                  {
                    day: 6,
                    hours: ['01:00'],
                  },
                ],
              })
              .set('Authorization', `Bearer ${interviewerAccessToken2}`)
              .expect(400);
          });
        });

        describe('no user info', () => {
          it('should send 400 BAD REQUEST', async () => {
            const interviewerAccessToken2 = await generateAccessToken(users[1].email);

            await request(app)
              .put('/api/v1/users/timeslots')
              .send({
                timeslots: [
                  {
                    day: 0,
                    hours: ['00:30'],
                  },
                  {
                    day: 1,
                    hours: ['00:00'],
                  },
                  {
                    day: 2,
                    hours: ['05:00'],
                  },
                  {
                    day: 3,
                    hours: ['09:30'],
                  },
                  {
                    day: 4,
                    hours: ['15:00'],
                  },
                  {
                    day: 5,
                    hours: ['10:00'],
                  },
                  {
                    day: 6,
                    hours: ['01:00'],
                  },
                ],
              })
              .set('Authorization', `Bearer ${interviewerAccessToken2}`)
              .expect(400);
          });
        });
      });

      describe('interviewee', () => {
        it('should send 403 FORBIDDEN', async () => {
          const intervieweeAccessToken2 = await generateAccessToken(users[3].email);

          await request(app)
            .put('/api/v1/users/timeslots')
            .send({
              timeslots: [],
            })
            .set('Authorization', `Bearer ${intervieweeAccessToken2}`)
            .expect(403);
        });
      });
    });

    describe('update email', () => {
      describe('valid access token', () => {
        it('should send 200 OK', async () => {
          const interviewerAccessToken2 = await generateAccessToken(users[1].email);
          const updateEmailAccessToken = await generateEmailUpdatingToken(users[1].email);

          await request(app)
            .put(`/api/v1/users/email/${updateEmailAccessToken}`)
            .set('Authorization', `Bearer ${interviewerAccessToken2}`)
            .expect(200);
        });
      });

      describe('invalid access token', () => {
        it('should send 401 UNAUTHORIZED', async () => {
          const interviewerAccessToken2 = await generateAccessToken(users[1].email);

          await request(app)
            .put(`/api/v1/users/email/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
            .set('Authorization', `Bearer ${interviewerAccessToken2}`)
            .expect(401);
        });
      });
    });

    describe('update password', () => {
      describe('valid update request', () => {
        it('should send 200 OK', async () => {
          const intervieweeAccessToken2 = await generateAccessToken(users[3].email);

          await request(app)
            .put(`/api/v1/users/password`)
            .send({
              oldPassword: '12345678',
              newPassword: '123456789',
              confirmPassword: '123456789',
            })
            .set('Authorization', `Bearer ${intervieweeAccessToken2}`)
            .expect(200);
        });
      });

      describe('incorrect old password', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken2 = await generateAccessToken(users[3].email);

          await request(app)
            .put(`/api/v1/users/password`)
            .send({
              oldPassword: '12345678xyz',
              newPassword: '12345678',
              confirmPassword: '12345678',
            })
            .set('Authorization', `Bearer ${intervieweeAccessToken2}`)
            .expect(400);
        });
      });

      describe('different new and confirm passwords', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken2 = await generateAccessToken(users[3].email);

          await request(app)
            .put(`/api/v1/users/password`)
            .send({
              oldPassword: '123456789',
              newPassword: '123456789',
              confirmPassword: '12345678',
            })
            .set('Authorization', `Bearer ${intervieweeAccessToken2}`)
            .expect(400);
        });
      });

      describe('empty old/new/confirmation passwords', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken2 = await generateAccessToken(users[3].email);

          await request(app)
            .put(`/api/v1/users/password`)
            .send({ oldPassword: '', newPassword: '', confirmPassword: '' })
            .set('Authorization', `Bearer ${intervieweeAccessToken2}`)
            .expect(400);
        });
      });

      describe('no old/new/confirmation passwords', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken2 = await generateAccessToken(users[3].email);

          await request(app)
            .put(`/api/v1/users/password`)
            .send({})
            .set('Authorization', `Bearer ${intervieweeAccessToken2}`)
            .expect(400);
        });
      });
    });
  });

  describe('reset password', () => {
    describe('valid update request', () => {
      it('should send 200 OK', async () => {
        const resetPasswordAccessToken = await generateResetPasswordToken(users[3].email);
        const intervieweeAccessToken2 = await generateAccessToken(users[3].email);

        await request(app)
          .put(`/api/v1/users/reset-password/${resetPasswordAccessToken}`)
          .send({
            newPassword: '12345678',
            confirmPassword: '12345678',
          })
          .set('Authorization', `Bearer ${intervieweeAccessToken2}`)
          .expect(200);
      });
    });

    describe('different new and confirm passwords', () => {
      it('should send 400 BAD REQUEST', async () => {
        const resetPasswordAccessToken = await generateResetPasswordToken(users[3].email);
        const intervieweeAccessToken2 = await generateAccessToken(users[3].email);

        await request(app)
          .put(`/api/v1/users/reset-password/${resetPasswordAccessToken}`)
          .send({
            newPassword: '12345678',
            confirmPassword: '123456789',
          })
          .set('Authorization', `Bearer ${intervieweeAccessToken2}`)
          .expect(400);
      });
    });

    describe('empty new/confirmation passwords', () => {
      it('should send 400 BAD REQUEST', async () => {
        const resetPasswordAccessToken = await generateResetPasswordToken(users[3].email);
        const intervieweeAccessToken2 = await generateAccessToken(users[3].email);

        await request(app)
          .put(`/api/v1/users/reset-password/${resetPasswordAccessToken}`)
          .send({
            newPassword: '',
            confirmPassword: '',
          })
          .set('Authorization', `Bearer ${intervieweeAccessToken2}`)
          .expect(400);
      });
    });

    describe('no new/confirmation passwords', () => {
      it('should send 400 BAD REQUEST', async () => {
        const resetPasswordAccessToken = await generateResetPasswordToken(users[3].email);
        const intervieweeAccessToken2 = await generateAccessToken(users[3].email);

        await request(app)
          .put(`/api/v1/users/reset-password/${resetPasswordAccessToken}`)
          .send({})
          .set('Authorization', `Bearer ${intervieweeAccessToken2}`)
          .expect(400);
      });
    });
  });

  // DELETE
  describe('DELETE', () => {
    describe('delete user image', () => {
      describe('user has or has no image', () => {
        it('should send 200 OK', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);

          await request(app)
            .delete('/api/v1/users/image')
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(200);
        });
      });
    });
  });
});
