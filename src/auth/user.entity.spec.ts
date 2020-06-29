import { User } from "./user.entity";
import * as bcrypt2 from 'bcryptjs';


describe('User Entity', () => {
  let user;
  let bcrypt;

  beforeEach(() => {
      user = new User;
      user.username = 'Test Username';
      user.salt = 'Test Salt';
      user.password = 'TestPassword';

      bcrypt = {...bcrypt2, hash: jest.fn()};
    //   bcrypt.hash = jest.fn();

  });

  describe('validatePassword', () => {

    it('return true if password is valid', async () => {

        // bcrypt.hash.mockReturnValue('TestPassword');
        // expect(bcrypt.hash).not.toHaveBeenCalled();
        // const result = await user.validatePassword('123456');
        // expect(result).toBeTruthy();
    });
  
    it('return false if password is invalid', () => {

    });

  });


});