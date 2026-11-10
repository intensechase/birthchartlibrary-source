import { hashPassword, verifyPassword, createToken, verifyToken } from '@/lib/auth'

jest.mock('@/lib/db', () => ({
  queryOne: jest.fn(),
}))

describe('password hashing', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('correcthorsebatterystaple')
    expect(hash).not.toBe('correcthorsebatterystaple')
    await expect(verifyPassword('correcthorsebatterystaple', hash)).resolves.toBe(true)
  })

  it('rejects wrong password', async () => {
    const hash = await hashPassword('rightpassword')
    await expect(verifyPassword('wrongpassword', hash)).resolves.toBe(false)
  })
})

describe('JWT tokens', () => {
  const user = { id: 'user-123', email: 'test@example.com' }

  it('creates and verifies a token', () => {
    const token = createToken(user)
    const payload = verifyToken(token)
    expect(payload).not.toBeNull()
    expect(payload!.sub).toBe('user-123')
    expect(payload!.email).toBe('test@example.com')
  })

  it('returns null for tampered token', () => {
    const token = createToken(user)
    const tampered = token.slice(0, -5) + 'XXXXX'
    expect(verifyToken(tampered)).toBeNull()
  })

  it('returns null for completely invalid token', () => {
    expect(verifyToken('not.a.token')).toBeNull()
  })
})
