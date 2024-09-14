import { IsString, IsEmail, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  @Length(6)
  password: string;
}
