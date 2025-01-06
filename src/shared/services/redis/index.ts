import Redis from 'ioredis';
import Env from '../../utils/envholder/env';

type addToRedisParams = {
  key: string;
  value: any;
  expiresIn?: number;
};

export type redisReturnVal = string | object | number | null | undefined;

export interface RedisService {
  addToRedis(params: addToRedisParams): Promise<boolean>;
  delFromRedis(key: string): Promise<boolean>;
  getFromRedis(key: string): Promise<redisReturnVal>;
  redisClient: Redis;
}

export class RedisServiceImpl implements RedisService {
  private readonly redisPort: any = Env.get<string>('REDIS_PORT');
  private readonly redisHost: any = Env.get<string>('REDIS_HOST');
  private readonly redisPass: any = Env.get<string>('REDIS_PASS');

  public readonly redisClient = new Redis({
    host: this.redisHost,
    password: this.redisPass,
    port: this.redisPort,
    maxRetriesPerRequest: null
  });

  public async addToRedis(params: addToRedisParams): Promise<boolean> {
    try {
      await this.redisClient.set(params.key, JSON.stringify(params.value));
      if (params.expiresIn)
        this.redisClient.expire(params.key, params.expiresIn);
      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async delFromRedis(key: string): Promise<boolean> {
    try {
      await this.redisClient.del(key);
      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getFromRedis(key: string): Promise<redisReturnVal> {
    try {
      const value = await this.redisClient.get(key);
      if (value) return JSON.parse(value);
      return value;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

const redisService = new RedisServiceImpl();
export default redisService;
