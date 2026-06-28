import { validateEnv } from './env.validation';

const VALID_SECRET = 'a'.repeat(32);
const VALID_DB = 'postgresql://u:p@localhost:5432/db?schema=public';

describe('validateEnv', () => {
  it('passes with a valid JWT_SECRET and DATABASE_URL', () => {
    const config = { JWT_SECRET: VALID_SECRET, DATABASE_URL: VALID_DB };
    expect(validateEnv(config)).toBe(config);
  });

  it('throws when JWT_SECRET is missing', () => {
    expect(() => validateEnv({ DATABASE_URL: VALID_DB })).toThrow(/JWT_SECRET/);
  });

  it('throws when JWT_SECRET is shorter than 32 chars', () => {
    expect(() => validateEnv({ JWT_SECRET: 'short', DATABASE_URL: VALID_DB })).toThrow(/JWT_SECRET/);
  });

  it('throws when DATABASE_URL is missing', () => {
    expect(() => validateEnv({ JWT_SECRET: VALID_SECRET })).toThrow(/DATABASE_URL/);
  });

  it('reports all missing variables at once', () => {
    expect(() => validateEnv({})).toThrow(/JWT_SECRET[\s\S]*DATABASE_URL/);
  });
});
