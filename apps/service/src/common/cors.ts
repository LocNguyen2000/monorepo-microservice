export function getAllowedOrigins(): string[] {
  const configuredOrigins = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .map((origin) => origin.replace(/\/+$/, ''))
    .filter(Boolean);

  if (!configuredOrigins?.length) {
    throw new Error(
      'CORS_ORIGINS must list the admin and rental-client origins.',
    );
  }

  const uniqueOrigins = Array.from(new Set(configuredOrigins));

  console.log('CORS_ORIGINS:', uniqueOrigins.join(', '));
  return uniqueOrigins;
}
