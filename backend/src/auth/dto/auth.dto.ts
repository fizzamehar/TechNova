import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  // Role is never accepted from the client. It is derived server-side from
  // the email domain in AuthService.signup() — anyone signing up with an
  // @technova.com email becomes ADMIN, everyone else is CUSTOMER.
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
