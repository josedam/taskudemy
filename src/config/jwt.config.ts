import { JwtModuleOptions } from '@nestjs/jwt'
import * as config from 'config';

const jwtConf = config.get('jwt');

export const jwtConfig: JwtModuleOptions = {
   secret: process.env.JWT_SECRET || jwtConf.secret,
   signOptions: {
       expiresIn: jwtConf.expiresIn,
   }
};