import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const resolveConnectionString = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing');
  }

  if (!databaseUrl.startsWith('prisma+postgres://')) {
    return databaseUrl;
  }

  const apiKey = new URL(databaseUrl).searchParams.get('api_key');
  if (!apiKey) {
    throw new Error('Prisma Postgres api_key is missing');
  }

  const payload = JSON.parse(Buffer.from(apiKey, 'base64url').toString('utf8'));
  return payload.databaseUrl as string;
};

const adapter = new PrismaPg({
  connectionString: resolveConnectionString(),
});
const prisma = new PrismaClient({ adapter });
export default prisma;
