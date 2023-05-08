import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY!!;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!!;
const AWS_BUCKET = process.env.AWS_BUCKET!!;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION!!;
const AWS_BUCKET_PUBLIC_URL = process.env.AWS_BUCKET_PUBLIC_URL!!;

export const s3Client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

