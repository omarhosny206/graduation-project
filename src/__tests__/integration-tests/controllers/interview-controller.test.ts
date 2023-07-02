import request from 'supertest';
import { app } from '../../../utils/server';
import { createMongoMemoryServer } from '../../../utils/mongo-memory-server';
import mongoose from 'mongoose';
import { saveUsers, users } from '../../dummy/users';
import { saveInterviews } from '../../dummy/interviews';
import {
  interviewId,
  interviewId2,
  interviewId3,
  interviewId4,
  intervieweeId,
  interviewerId,
  interviewerId2,
} from '../../dummy/ids';
import { generateAccessToken } from '../../../utils/jwt';

beforeAll(async () => {
  const mongoServer = await createMongoMemoryServer();
  mongoose.connect(mongoServer!!.getUri());
  await saveUsers();
  await saveInterviews();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('interview-controller', () => {
  // GET
  describe('GET', () => {
    describe('get all interviews', () => {
      describe('valid query strings', () => {
        it('should send 200 OK', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .get('/api/v1/interviews?type=had&&status=finished')
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(200);
        });
      });

      describe('invalid query strings missing type', () => {
        it('should send 200 OK', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .get('/api/v1/interviews?status=finished')
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });

      describe('invalid query strings wrong type', () => {
        it('should send 200 OK', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .get('/api/v1/interviews?type=xxx&&status=finished')
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });

      describe('invalid query strings missing status', () => {
        it('should send 200 OK', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .get('/api/v1/interviews?type=had')
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });

      describe('invalid query strings wrong status', () => {
        it('should send 200 OK', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .get('/api/v1/interviews?type=had&&status=xxx')
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });
    });
  });

  describe('get interview profile', () => {
    describe('existing interview', () => {
      it('should send 200 OK', async () => {
        await request(app).get(`/api/v1/interviews/${interviewId}`).expect(200);
      });
    });
    describe('non existing interview', () => {
      it('should send 400 BAD REQUEST', async () => {
        await request(app).get(`/api/v1/interviews/644ee3c6dbaca4e9bc978bd1`).expect(400);
      });
    });
  });

  describe('get interviews had', () => {
    describe('existing user', () => {
      it('should send 200 OK', async () => {
        await request(app).get(`/api/v1/interviews/interviews-had/omarhosny102`).expect(200);
      });
    });
    describe('non existing user', () => {
      it('should send 400 BAD REQUEST', async () => {
        await request(app).get(`/api/v1/interviews/interviews-had/omarhosny`).expect(400);
      });
    });
  });

  describe('get interviews made', () => {
    describe('interviewer', () => {
      describe('existing user', () => {
        it('should send 200 OK', async () => {
          await request(app).get(`/api/v1/interviews/interviews-made/omarhosny102`).expect(200);
        });
      });
      describe('non existing user', () => {
        it('should send 400 BAD REQUEST', async () => {
          await request(app).get(`/api/v1/interviews/interviews-had/omarhosny`).expect(400);
        });
      });
    });
    describe('interviewee', () => {
      describe('existing user', () => {
        it('should send 400 BAD REQUEST', async () => {
          await request(app).get(`/api/v1/interviews/interviews-made/softwarenotes1`).expect(400);
        });
      });
      describe('non existing user', () => {
        it('should send 400 BAD REQUEST', async () => {
          await request(app).get(`/api/v1/interviews/interviews-had/software`).expect(400);
        });
      });
    });
  });

  // POST
  describe('POST', () => {
    describe('book interview', () => {
      describe('valid request', () => {
        it('should send 201 CREATED', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .post('/api/v1/interviews')
            .send({
              interviewer: interviewerId.toString(),
              interviewee: intervieweeId.toString(),
              date: new Date(new Date().getTime() + 1000),
            })
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(201);
        });
      });

      describe('date in the past', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[2].email);
          await request(app)
            .post('/api/v1/interviews')
            .send({
              interviewer: interviewerId.toString(),
              interviewee: intervieweeId.toString(),
              date: new Date('2023-06-15T15:00:00.000+03:00'),
            })
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });

      describe('not a member in the interview', () => {
        it('should send 400 BAD REQUEST', async () => {
          const intervieweeAccessToken = await generateAccessToken(users[3].email);
          await request(app)
            .post('/api/v1/interviews')
            .send({
              interviewer: interviewerId.toString(),
              interviewee: interviewerId.toString(),
              date: new Date('2023-06-20T15:00:00.000+03:00'),
            })
            .set('Authorization', `Bearer ${intervieweeAccessToken}`)
            .expect(400);
        });
      });

      describe('2 identical users', () => {
        it('should send 400 BAD REQUEST', async () => {
          const interviewerAccessToken = await generateAccessToken(users[0].email);
          await request(app)
            .post('/api/v1/interviews')
            .send({
              interviewer: interviewerId.toString(),
              interviewee: interviewerId.toString(),
              date: new Date('2023-06-20T15:00:00.000+03:00'),
            })
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });

      describe('the interviewer is not a real interviewer', () => {
        it('should send 400 BAD REQUEST', async () => {
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .post('/api/v1/interviews')
            .send({
              interviewer: intervieweeId.toString(),
              interviewee: interviewerId.toString(),
              date: new Date('2023-06-20T15:00:00.000+03:00'),
            })
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });

      describe('no user info for interviewer or interviewee', () => {
        it('should send 400 BAD REQUEST', async () => {
          const interviewerAccessToken = await generateAccessToken(users[0].email);

          await request(app)
            .post('/api/v1/interviews')
            .send({
              interviewer: interviewerId.toString(),
              interviewee: interviewerId2.toString(),
              date: new Date('2023-06-20T15:00:00.000+03:00'),
            })
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });
    });
  });

  // PUT
  describe('PUT', () => {
    describe('update interview info', () => {
      describe('existing interview', () => {
        describe('valid update request', () => {
          it('should send 200 OK', async () => {
            const updateInterviewInfoRequest = {
              title: 'Amazon interview',
              summary: 'Data Structures and Algorithms interview',
              tags: ['Graph', 'Tree', 'BFS', 'DFS'],
              youtubeUrl: '...',
            };
            const interviewerAccessToken = await generateAccessToken(users[0].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId}`)
              .send(updateInterviewInfoRequest)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(200);
          });
        });

        describe('not a member in the interview', () => {
          it('should send 400 BAD REQUEST', async () => {
            const updateInterviewInfoRequest = {
              title: 'Amazon interview',
              summary: 'Data Structures and Algorithms interview',
              tags: ['Graph', 'Tree', 'BFS', 'DFS'],
              youtubeUrl: '...',
            };
            const interviewerAccessToken = await generateAccessToken(users[3].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId}`)
              .send(updateInterviewInfoRequest)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });

        describe('missing title or summary or tags', () => {
          it('should send 400 BAD REQUEST', async () => {
            const updateInterviewInfoRequest = {
              summary: '',
              tags: [],
              youtubeUrl: '...',
            };
            const interviewerAccessToken = await generateAccessToken(users[0].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId}`)
              .send(updateInterviewInfoRequest)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });

        describe('not finished interview', () => {
          it('should send 400 BAD REQUEST', async () => {
            const updateInterviewInfoRequest = {
              title: 'Amazon interview',
              summary: 'Data Structures and Algorithms interview',
              tags: ['Graph', 'Tree', 'BFS', 'DFS'],
              youtubeUrl: '...',
            };
            const interviewerAccessToken = await generateAccessToken(users[0].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId2}`)
              .send(updateInterviewInfoRequest)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });
      });

      describe('non existing interview', () => {
        it('should send 400 BAD REQUEST', async () => {
          const updateInterviewInfoRequest = {
            title: 'Amazon interview',
            summary: 'Data Structures and Algorithms interview',
            tags: ['Graph', 'Tree', 'BFS', 'DFS'],
            youtubeUrl: '...',
          };
          const interviewerAccessToken = await generateAccessToken(users[0].email);
          await request(app)
            .put(`/api/v1/interviews/644c22c0de5f8d9e503b6951`)
            .send(updateInterviewInfoRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });
    });

    describe('update interview review', () => {
      describe('existing interview', () => {
        describe('valid update request', () => {
          it('should send 200 OK', async () => {
            const updateInterviewReviewsRequest = {
              from: interviewerId.toString(),
              to: intervieweeId.toString(),
              feedback: 'great interviewee with high experience and communication skills',
              rating: 4,
            };
            const interviewerAccessToken = await generateAccessToken(users[0].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId}/reviews`)
              .send(updateInterviewReviewsRequest)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(200);
          });
        });

        describe('not an author in this review', () => {
          it('should send 400 BAD REQUEST', async () => {
            const updateInterviewReviewsRequest = {
              from: interviewerId.toString(),
              to: intervieweeId.toString(),
              feedback: 'great interviewee with high experience and communication skills',
              rating: 4,
            };
            const interviewerAccessToken = await generateAccessToken(users[3].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId2}/reviews`)
              .send(updateInterviewReviewsRequest)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });

        describe('not a member in the interview', () => {
          it('should send 400 BAD REQUEST', async () => {
            const updateInterviewReviewsRequest = {
              from: interviewerId2.toString(),
              to: intervieweeId.toString(),
              feedback: 'great interviewee with high experience and communication skills',
              rating: 4,
            };
            const interviewerAccessToken = await generateAccessToken(users[1].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId2}/reviews`)
              .send(updateInterviewReviewsRequest)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });

        describe('missing from, to, feedback or rating', () => {
          it('should send 400 BAD REQUEST', async () => {
            const updateInterviewReviewsRequest = {
              feedback: '',
              rating: 4,
            };
            const interviewerAccessToken = await generateAccessToken(users[0].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId2}/reviews`)
              .send(updateInterviewReviewsRequest)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });

        describe('not finished interview', () => {
          it('should send 400 BAD REQUEST', async () => {
            const updateInterviewReviewsRequest = {
              from: interviewerId.toString(),
              to: intervieweeId.toString(),
              feedback: 'great interviewee with high experience and communication skills',
              rating: 4,
            };
            const interviewerAccessToken = await generateAccessToken(users[0].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId2}/reviews`)
              .send(updateInterviewReviewsRequest)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });
      });

      describe('non existing interview', () => {
        it('should send 400 BAD REQUEST', async () => {
          const updateInterviewReviewsRequest = {
            from: interviewerId.toString(),
            to: intervieweeId.toString(),
            feedback: 'great interviewee with high experience and communication skills',
            rating: 4,
          };
          const interviewerAccessToken = await generateAccessToken(users[0].email);
          await request(app)
            .put(`/api/v1/interviews/644c22c0de5f8d9e503b6951/reviews`)
            .send(updateInterviewReviewsRequest)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });
    });

    describe('reject interview', () => {
      describe('existing interview', () => {
        describe('valid request for pending interview', () => {
          it('should send 200 OK', async () => {
            const interviewerAccessToken = await generateAccessToken(users[0].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId2}/rejection`)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(200);
          });
        });

        describe('in confirmed or finished status', () => {
          it('should send 400 BAD REQUEST', async () => {
            const interviewerAccessToken = await generateAccessToken(users[0].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId}/rejection`)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });

        describe('not a member in the interview', () => {
          it('should send 400 BAD REQUEST', async () => {
            const interviewerAccessToken = await generateAccessToken(users[1].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId2}/rejection`)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });
      });

      describe('non existing interview', () => {
        it('should send 400 BAD REQUEST', async () => {
          const interviewerAccessToken = await generateAccessToken(users[0].email);
          await request(app)
            .put(`/api/v1/interviews/644c22c0de5f8d9e503b6951/rejection`)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });
    });

    describe('confirm interview', () => {
      describe('existing interview', () => {
        describe('valid request for pending interview', () => {
          it('should send 200 OK', async () => {
            const interviewerAccessToken = await generateAccessToken(users[0].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId3}/confirmation`)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(200);
          });
        });

        describe('in rejected or finished status', () => {
          it('should send 400 BAD REQUEST', async () => {
            const interviewerAccessToken = await generateAccessToken(users[0].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId}/confirmation`)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });

        describe('not the interviewer of the interview', () => {
          it('should send 400 BAD REQUEST', async () => {
            console.log('ABC:', users[1]._id.toString());

            const interviewerAccessToken = await generateAccessToken(users[1].email);
            await request(app)
              .put(`/api/v1/interviews/${interviewId4}/confirmation`)
              .set('Authorization', `Bearer ${interviewerAccessToken}`)
              .expect(400);
          });
        });
      });

      describe('non existing interview', () => {
        it('should send 400 BAD REQUEST', async () => {
          const interviewerAccessToken = await generateAccessToken(users[0].email);
          await request(app)
            .put(`/api/v1/interviews/644c22c0de5f8d9e503b6951/confirmation`)
            .set('Authorization', `Bearer ${interviewerAccessToken}`)
            .expect(400);
        });
      });
    });
  });
});
