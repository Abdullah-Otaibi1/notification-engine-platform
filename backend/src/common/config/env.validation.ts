/**
 * Fail-fast validation of required environment variables at application boot.
 * Passed to `ConfigModule.forRoot({ validate })` so a misconfigured deployment
 * crashes immediately with a clear message instead of failing later at runtime
 * (e.g. JWT signing) with an opaque error.
 */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const errors: string[] = [];

  const jwtSecret = config['JWT_SECRET'];
  if (typeof jwtSecret !== 'string' || jwtSecret.length < 32) {
    errors.push('JWT_SECRET must be set and at least 32 characters long.');
  }

  const databaseUrl = config['DATABASE_URL'];
  if (typeof databaseUrl !== 'string' || databaseUrl.length === 0) {
    errors.push('DATABASE_URL must be set.');
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid environment configuration:\n - ${errors.join('\n - ')}`,
    );
  }

  return config;
}
