import crypto from 'crypto';
import sharp from 'sharp';

import ApiError from '../utils/api-error';
import { AuthenticatedUser } from '../utils/authenticated-user-type';
import * as awsS3Service from './aws-s3-service';

const AWS_BUCKET_PUBLIC_URL = process.env.AWS_BUCKET_PUBLIC_URL!!;

export async function upload(user: AuthenticatedUser, fileBuffer: Buffer, contentType: string) {
  try {
    let fileKey = '';

    if (user.imageKey !== '') {
      fileKey = user.imageKey;
    } else {
      fileKey = crypto.randomBytes(32).toString('hex');
    }

    fileBuffer = await sharpen(fileBuffer);

    await awsS3Service.upload(fileKey, fileBuffer, contentType);

    if (user.imageKey !== fileKey) {
      user.imageKey = fileKey;
      user.imageUrl = `${AWS_BUCKET_PUBLIC_URL}/${user.imageKey}`;
      const updatedUser = await user.save();
      return updatedUser;
    }

    return user;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function remove(user: AuthenticatedUser) {
  try {
    if (user.imageKey === '') {
      return user;
    }

    const fileKey = user.imageKey;

    await awsS3Service.remove(fileKey);

    user.imageKey = '';
    user.imageUrl = '';
    const updatedUser = await user.save();

    return updatedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}

async function sharpen(fileBuffer: Buffer) {
  try {
    return await sharp(fileBuffer).resize({ height: 1920, width: 1080, fit: 'contain' }).toBuffer();
  } catch (error) {
    throw ApiError.from(error);
  }
}
