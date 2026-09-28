import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserRole } from '../users/enum/user-role.enum.js';
import { User } from '../users/entities/user.entity.js';
import { UnauthorizedException } from '@nestjs/common';

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
  },
}))

describe('AuthService', () => {
  let service: AuthService;

  let findByEmailMock: ReturnType<typeof vi.fn>
  let signMock: ReturnType<typeof vi.fn>

  beforeEach(async () => {

    findByEmailMock = vi.fn();
    signMock = vi.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: findByEmailMock,
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: signMock,
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  const user: User = {
    id: 1,
    name: 'user',
    email: 'user@example.com',
    password: '123_user',
    role: UserRole.USER,
  }
  const token = '1234567890'

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call userService.findByEmail, jwtService.sign and bcrypt.compare', async () => {
    
    findByEmailMock.mockResolvedValue(user)
    vi.mocked(bcrypt.compare).mockImplementation(async () => true)
    signMock.mockReturnValue(token)

    await service.login({
      email: user.email,
      password: user.password,
    })

    expect(findByEmailMock).toHaveBeenCalledWith(user.email)
    expect(vi.mocked(bcrypt.compare)).toHaveBeenCalledWith(
      user.password,
      user.password
    )
    expect(signMock).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: user.role,
    })
  })

  it('should return the access token', async () => {
    findByEmailMock.mockResolvedValue(user)
    signMock.mockReturnValue(token)

    const result = await service.login({
      email: user.email,
      password: user.password,
    })

    expect(result).toEqual({access_token: token})

  })

  it('should throw UnauthorizedException if email is not exist.', async () => {
    findByEmailMock.mockResolvedValue(null)

    const promise = service.login({
      email: 'not_exist_email@example.com',
      password: '123_user'
    })

    await expect(promise).rejects.toThrow(UnauthorizedException)
    await expect(promise).rejects.toThrow('Incorrect email or password.')
  })

  it('should throw UnauthorizedException if password is not valid.', async () => {
    findByEmailMock.mockResolvedValue(user)
    vi.mocked(bcrypt.compare).mockImplementation(async () => false)

    const promise = service.login({
      email: user.email,
      password: '123_wrong'
    })

    await expect(promise).rejects.toThrow(UnauthorizedException)
    await expect(promise).rejects.toThrow('Incorrect email or password.')
  })
});
