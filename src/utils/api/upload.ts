import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import ENV from './env';
import * as fs from 'fs';
import * as path from 'path';
import { prismaAny } from './prisma';
import { randomUUID } from 'crypto';
import { handleError } from '.';

const folderName = 'gorent';

type Options = {
  types?: string[];
};

const s3Client = new S3Client({
  forcePathStyle: false,
  endpoint: ENV.DO.ENDPOINT?.replace(`${ENV.DO.BUCKET_NAME}.`, ''),
  region: 'SGP1',
  credentials: {
    accessKeyId: ENV.DO.ACCESS_KEY!,
    secretAccessKey: ENV.DO.SECRET_KEY!,
  },
});

async function uploadS3(file: File, options: Options = {}) {
  const { types = ['ALL'] } = options;
  if (!file) throw new Error(`missing argument file`);
  const mimetype = file.type;
  const mime = mimetype?.split('/');

  const passType = types.find((x: any) => mimetype?.includes(x));
  if (!types.includes('ALL') && !passType) {
    throw new Error(`Only ${types} files are allowed`);
  }
  const fileNameWithoutExt = file?.name?.split('.')?.slice(0, -1)?.join('.');
  const joinedFileName = fileNameWithoutExt?.replace(/[\s-]+/g, '_');

  const newFileName = `${joinedFileName}-${randomUUID()}.${file.name.split('.').pop() || mime[1]}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: ENV.DO.BUCKET_NAME!,
    Key: `${folderName}/${newFileName}`,
    Body: buffer,
    ACL: 'public-read',
    ContentType: file.type,
  });
  await s3Client.send(command);
  return {
    name: newFileName,
    type: mimetype,
    link: `${ENV.DO.ENDPOINT}/${folderName}/${newFileName}`,
  };
}

export async function uploadMultipleS3(files: File[], options: Options = {}) {
  if (!files) throw new Error(`missing argument files`);
  const uploadPromises = files.map(
    async (file) => await uploadS3(file, options),
  );
  const uploadedFiles = await Promise.all(uploadPromises);
  return uploadedFiles;
}
