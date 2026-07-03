import { createClient } from 'redis';

// Using the port specified in docker-compose.yml
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
