import { JwtModuleOptions } from '@nestjs/jwt'

export const jwtConfig: JwtModuleOptions = {
   secret: 'LaClaveSecreta2020',
   signOptions: {
       expiresIn: 3600,
   }
};