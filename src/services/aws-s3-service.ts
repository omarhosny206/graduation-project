import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { s3Client } from "../config/aws-s3-config";
import ApiError from "../utils/api-error";

const AWS_BUCKET = process.env.AWS_BUCKET!!;

export async function upload(fileKey: string, fileBuffer: Buffer, contentType: string) {
  try {
    const uploadParams = {
      Bucket: AWS_BUCKET,
      Body: fileBuffer,
      Key: fileKey,
      ContentType: contentType,
    };

    const putObjectCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(putObjectCommand);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function remove(fileKey: string) {
  try {
    const deleteParams = {
      Bucket: AWS_BUCKET,
      Key: fileKey,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3Client.send(deleteCommand);
  } catch (error) {
    throw ApiError.from(error);
  }
}