import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialsDto {

    @IsString({message:'.'})
    @MinLength(4,{message:'.'})
    @MaxLength(20,{message:'.'})
    username: string;

    @IsString({message:'.'})
    @MinLength(8,{message:'.'})
    @MaxLength(20, {message:'.'})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{message: '.'})
    password: string;
}