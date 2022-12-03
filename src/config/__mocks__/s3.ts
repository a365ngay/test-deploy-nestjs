import { AWSError, S3 } from 'aws-sdk';
import stream from 'stream';

export const bucket = 'some-bucket';
export const acl = 'private';

export const s3 = {
  getObject(params: { Bucket: string; Key: string }) {
    return {
      createReadStream: () => {
        const readable = new stream.Readable();
        readable.push('hello world');
        readable.push(null);
        return readable;
      },
    };
  },
  deleteObject(
    params: { Bucket: string; Key: string },
    callback?: (err: AWSError, data: S3.Types.DeleteObjectOutput) => void,
  ) {
    return callback(null, {});
  },
};
