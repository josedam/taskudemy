import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import { ConflictException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { User } from "./user.entity";



const mockCredentialDto = {username: 'Test Username', password: 'Test Password'};

describe('UserRepository', () => {

    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ]
        }).compile();
        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp', () => {
        let save;
      
        beforeEach(() => {
            save = jest.fn();
            userRepository.save = save;
        });

        it('successfully SignUp the user', () => {
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockCredentialDto)).resolves.not.toThrow();
        });
        
        it('throw conflict exception as userName already exist', async () => {
            save.mockRejectedValue({code: 'ER_DUP_ENTRY'});
            await expect( userRepository.signUp(mockCredentialDto)).rejects.toThrow(ConflictException);
        });
    
        it('throw internal exception uncknow error in database', async () => {
            save.mockRejectedValue({code: 'DUMMY_ERROR'}); // Valor inexistente
            await expect( userRepository.signUp(mockCredentialDto)).rejects.toThrow(InternalServerErrorException);
        });

    });

    describe('validateUserPassword', () => {

        let mockUser;

        beforeEach(() => {
            userRepository.findOne = jest.fn();

            mockUser = new User;
            mockUser.username = 'Test Username';
            mockUser.validatePassword = jest.fn();
        });

        it('return username is validation is success', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);
            mockUser.validatePassword.mockResolvedValue(true);

            const result = await userRepository.validateUserPassword(mockCredentialDto);
            expect(result).toEqual(mockUser.username);
        });
        
        it('return null as user cannot be found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            mockUser.validatePassword.mockResolvedValue(true);
    
            await expect(userRepository.validateUserPassword(mockCredentialDto)).rejects.toThrow(UnauthorizedException);
            
        });
        
        it('return null as password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);
            mockUser.validatePassword.mockResolvedValue(false);
    
            await expect(userRepository.validateUserPassword(mockCredentialDto)).rejects.toThrow(UnauthorizedException);
        });

    });
});