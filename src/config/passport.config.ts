import { IAuthModuleOptions } from "@nestjs/passport";


export const passportConfig: IAuthModuleOptions<any> = {
    defaultStrategy:'jwt'
}