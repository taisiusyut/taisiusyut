import { validateRole } from './access.guard';
import { UserRole } from '@/typings';

describe('validateRole', () => {
  test('Root user can access all role', () => {
    expect(validateRole(UserRole.Root, UserRole.Root)).toBe(true);
    expect(validateRole(UserRole.Admin, UserRole.Root)).toBe(true);
    expect(validateRole(UserRole.Author, UserRole.Root)).toBe(true);
    expect(validateRole(UserRole.Client, UserRole.Root)).toBe(true);
  });

  test('Admin user can access author and client', () => {
    expect(validateRole(UserRole.Root, UserRole.Admin)).toBe(false);
    expect(validateRole(UserRole.Admin, UserRole.Admin)).toBe(false);
    expect(validateRole(UserRole.Author, UserRole.Admin)).toBe(true);
    expect(validateRole(UserRole.Client, UserRole.Admin)).toBe(true);
  });

  test.each([
    ['Author', UserRole.Author],
    ['Client', UserRole.Client]
  ])('%s user can access client only', (_, role) => {
    expect(validateRole(UserRole.Root, role)).toBe(false);
    expect(validateRole(UserRole.Admin, role)).toBe(false);
    expect(validateRole(UserRole.Author, role)).toBe(false);
    expect(validateRole(UserRole.Client, role)).toBe(true);
  });

  test('Client is not require user role', () => {
    expect(validateRole(UserRole.Client)).toBe(true);
  });
});
