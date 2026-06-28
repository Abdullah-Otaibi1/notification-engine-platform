import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

describe('AuthService.validateUser', () => {
  let service: AuthService;
  let prisma: { user: { findUnique: jest.Mock } };
  const jwt = { sign: jest.fn().mockReturnValue('signed.jwt.token') } as any;

  const buildUser = async (overrides: Partial<any> = {}) => ({
    id: 'u1',
    username: 'admin',
    displayName: 'Admin',
    email: 'a@b.c',
    role: 'Admin',
    isActive: true,
    passwordHash: await bcrypt.hash('correct-horse', 12),
    ...overrides,
  });

  beforeEach(() => {
    prisma = { user: { findUnique: jest.fn() } };
    service = new AuthService(prisma as any, jwt);
  });

  it('returns the user without the password hash on valid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(await buildUser());
    const result = await service.validateUser('admin', 'correct-horse');
    expect(result).toMatchObject({ id: 'u1', username: 'admin', role: 'Admin' });
    expect((result as any).passwordHash).toBeUndefined();
  });

  it('throws on a wrong password', async () => {
    prisma.user.findUnique.mockResolvedValue(await buildUser());
    await expect(service.validateUser('admin', 'wrong')).rejects.toThrow(UnauthorizedException);
  });

  it('throws when the user does not exist (and still runs a hash compare)', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const spy = jest.spyOn(bcrypt, 'compare');
    await expect(service.validateUser('ghost', 'whatever')).rejects.toThrow(UnauthorizedException);
    expect(spy).toHaveBeenCalled(); // constant-time path: compares against dummy hash
    spy.mockRestore();
  });

  it('throws for an inactive user even with the right password', async () => {
    prisma.user.findUnique.mockResolvedValue(await buildUser({ isActive: false }));
    await expect(service.validateUser('admin', 'correct-horse')).rejects.toThrow(UnauthorizedException);
  });
});
