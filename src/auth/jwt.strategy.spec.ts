import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => {
  findOne: jest.fn();
};

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.username = 'TestUsername';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        UserRepository,
        //   {provide: UserRepository, useFactory: mockUserRepository},
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userRepository.findOne = jest.fn();
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('return User when accpeted ', () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      expect(
        jwtStrategy.validate({ username: 'TestUsername' }),
      ).resolves.toEqual(mockUser);
    });

    it('Reject when user not found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(
        jwtStrategy.validate({ username: 'TestUsername' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
