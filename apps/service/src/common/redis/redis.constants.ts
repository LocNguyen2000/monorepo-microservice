export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const cacheLocationsByAccountKey = (
  accountId: number,
  page?: number,
  size?: number,
) => `locations:account:${accountId}:page:${page}:size:${size}`;

export const cacheLocationsByAccountPattern = (accountId: number) =>
  `locations:account:${accountId}:page:*:size:*`;

export const cacheLocationIdByAccountKey = (accountId: number, locationId: number) =>
  `location:account:${accountId}:locationId:${locationId}`;

export const cacheLocationIdByAccountPattern = (accountId: number) =>
  `location:account:${accountId}:locationId:*`;
