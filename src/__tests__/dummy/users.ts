import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { LevelOfExperience } from '../../enums/level-of-experience-enum';
import { Role } from '../../enums/role-enum';
import IUser from '../../interfaces/users/user-interface';
import { save } from '../../services/user-service';
import { intervieweeId, intervieweeId2, interviewerId, interviewerId2 } from './ids';

export const users: IUser[] = [
  {
    _id: interviewerId,
    email: 'omarhosny102@gmail.com',
    password: bcrypt.hashSync('12345678', 10),
    role: Role.Interviewer,
    username: 'omarhosny102',
    active: true,
    confirmed: true,
    imageKey: '',
    imageUrl: '',
    info: {
      firstName: 'x',
      lastName: 'y',
      price: 10,
      priceable: true,
      skills: ['Backend', 'Frontend'],
      bio: "Hey, i'm omar",
      levelOfExperience: LevelOfExperience.Junior,
      interviewsHad: [],
      interviewsMade: [],
      timeslots: [],
      socials: { linkedin: 'linkedin', github: 'github', twitter: 'twitter' },
    },
  },
  {
    _id: interviewerId2,
    email: 'omarhosnykishk@gmail.com',
    password: bcrypt.hashSync('12345678', 10),
    role: Role.Interviewer,
    username: 'omarhosnykishk',
    active: true,
    confirmed: true,
    imageKey: '',
    imageUrl: '',
  },
  {
    _id: intervieweeId,
    email: 'softwarenotes1@gmail.com',
    password: bcrypt.hashSync('12345678', 10),
    role: Role.Interviewee,
    username: 'softwarenotes1',
    active: true,
    confirmed: true,
    imageKey: '555555555555599798845454548878484',
    imageUrl: 'https://pass-interviews-users-images.s3.amazonaws.com/555555555555599798845454548878484',
    info: {
      firstName: 'x',
      lastName: 'y',
      price: 0,
      priceable: false,
      skills: ['Backend', 'Frontend'],
      bio: "Hey, i'm omar",
      levelOfExperience: LevelOfExperience.Junior,
      interviewsHad: [],
      interviewsMade: [],
      timeslots: [],
      socials: { linkedin: 'linkedin', github: 'github', twitter: 'twitter' },
    },
  },
  {
    _id: intervieweeId2,
    email: 'alex@gmail.com',
    password: bcrypt.hashSync('12345678', 10),
    role: Role.Interviewee,
    username: 'alex',
    active: true,
    confirmed: true,
    imageKey: '',
    imageUrl: '',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    email: 'omaraws@gmail.com',
    password: bcrypt.hashSync('12345678', 10),
    role: Role.Interviewer,
    username: 'omaraws',
    active: true,
    confirmed: true,
    imageKey: '',
    imageUrl: '',
    info: {
      firstName: 'x',
      lastName: 'y',
      price: 10,
      priceable: true,
      skills: ['Backend', 'Frontend'],
      bio: "Hey, i'm omar",
      levelOfExperience: LevelOfExperience.Junior,
      interviewsHad: [],
      interviewsMade: [],
      timeslots: [],
      socials: { linkedin: 'linkedin', github: 'github', twitter: 'twitter' },
    },
  },
];

export async function saveUsers() {
  try {
    users.forEach(async (user) => await save(user));
  } catch (error) {
    console.log('NOT SAVED:', error.message);
  }
}
