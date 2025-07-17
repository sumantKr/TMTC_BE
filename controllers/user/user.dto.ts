import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;
}


export class LoginUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  @MinLength(6)
  password: string;
}
