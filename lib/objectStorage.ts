/**
 * Hetzner Object Storage (S3-compatible) utility for BCL
 * Bucket: bcl-files | Location: Helsinki (hel1)
 */

import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { env } from './env'

const s3 = new S3Client({
  region: 'hel1',
  endpoint: 'https://hel1.your-objectstorage.com',
  credentials: {
    accessKeyId: env.s3AccessKey,
    secretAccessKey: env.s3SecretKey,
  },
  forcePathStyle: true,
})

const BUCKET = env.s3Bucket

export async function s3Exists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }))
    return true
  } catch {
    return false
  }
}

export async function s3Upload(key: string, buffer: Buffer, contentType = 'application/octet-stream'): Promise<void> {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }))
}

export async function s3Download(key: string): Promise<Buffer | null> {
  try {
    const response = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))
    const chunks: Buffer[] = []
    for await (const chunk of response.Body as AsyncIterable<Buffer>) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks)
  } catch {
    return null
  }
}
