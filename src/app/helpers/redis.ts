import { createClient } from 'redis';
import config from '../config';

export const redisClient = createClient({
  username: 'default',
  password: config.redis.PASS,
  socket: {
    host: config.redis.HOST,
    port: Number(config.redis.REDIS_PORT)
  }
});

redisClient.on('error', err => console.log('Redis Client Error', err));


// await redisClient.set('foo', 'bar');
// const result = await redisClient.get('foo');
// console.log(result)  // >>> bar

