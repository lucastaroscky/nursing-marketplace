export const REDIS_REFRESH_TOKEN_KEY = (userId: string) =>
  `refresh_token:${userId}`;
