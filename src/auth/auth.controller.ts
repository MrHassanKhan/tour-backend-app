import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Credentials } from "../auth/Credentials";
import { UserCreated, UserInfo } from "./UserInfo";
import { RegisterArgs } from "./LoginArgs";

@ApiTags("auth")
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("login")
  async login(@Body() body: Credentials): Promise<UserInfo> {
    return this.authService.login(body);
  }

  @Post("register")
  async register(@Body() body: RegisterArgs): Promise<UserCreated> {
    return this.authService.createUserAuth(body);
  }
}
