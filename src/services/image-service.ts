import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import ApiError from '../utils/api-error';
import crypto from 'crypto';
import sharp from 'sharp';
import { AuthenticatedUser } from '../utils/authenticated-user-type';

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY!!;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!!;
const AWS_BUCKET = process.env.AWS_BUCKET!!;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION!!;
const AWS_BUCKET_PUBLIC_URL = process.env.AWS_BUCKET_PUBLIC_URL!!;

const s3Client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function upload(user: AuthenticatedUser, fileBuffer: Buffer, contentType: string) {
  try {
    let fileKey = '';

    if (user.imageKey !== '') {
      fileKey = user.imageKey;
    } else {
      fileKey = crypto.randomBytes(32).toString('hex');
    }

    fileBuffer = await sharpen(fileBuffer);

    const uploadParams = {
      Bucket: AWS_BUCKET,
      Body: fileBuffer,
      Key: fileKey,
      ContentType: contentType,
    };

    const putObjectCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(putObjectCommand);

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

    const deleteParams = {
      Bucket: AWS_BUCKET,
      Key: fileKey,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3Client.send(deleteCommand);

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
