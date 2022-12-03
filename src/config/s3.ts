import aws from 'aws-sdk';
import { validateInput } from '../utils';

const envConfig = validateInput();
const accessKeyId = envConfig.AWS_ACCESS_KEY_ID;
const secretAccessKey = envConfig.AWS_SECRET_ACCESS_KEY;
const region = envConfig.AWS_REGION;
export const bucket = envConfig.S3_BUCKET_NAME;
export const acl = 'private';

export const s3 = new aws.S3({
  accessKeyId,
  secretAccessKey,
  region,
});
