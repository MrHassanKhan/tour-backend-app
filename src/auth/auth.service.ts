import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Credentials } from "./Credentials";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { UserCreated, UserInfo } from "./UserInfo";
import { UserService } from "../user/user.service";
import { RegisterArgs } from "./LoginArgs";

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {}

  async validateUser(
    phoneNumber: string,
    password: string
  ): Promise<{id: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    isPhoneVerified: boolean;
    twoFA: boolean;
    roles: string[];}> {
    const user = await this.userService.user({
      where: { phoneNumber },
    });
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPasswordValid = await this.passwordService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    // const { id, roles } = user;
    // const roleList = roles as string[];
    return {...user, firstName: user.firstName||'', lastName: user.lastName||'', roles: user.roles as string[]};
  }
  async login(credentials: Credentials): Promise<UserInfo> {
    const { phoneNumber, password } = credentials;
    const user = await this.validateUser(
      credentials.phoneNumber,
      credentials.password
    );
    if (!user) {
      throw new UnauthorizedException("The passed credentials are incorrect");
    }
    const accessToken = await this.tokenService.createToken({
      id: user.id,
      phoneNumber,
      password,
    });
    return {
      accessToken,
      ...user,
    };
  }

  async validateToken(accessToken: string): Promise<UserInfo | null> {
    const payload = await this.tokenService.verifyToken(accessToken);
    if (!payload) {
      return null;
    }
    const user = await this.userService.user({
      where: { id: payload.id },
    });
    if (!user) {
      return null;
    }
    const { id, roles } = user;
    const roleList = roles as string[];
    return { id, phoneNumber: user.phoneNumber, firstName: user.firstName || '', 
    lastName: user.lastName||'', roles: roleList };
  }

  async refreshToken(accessToken: string): Promise<string> {
    const payload = await this.tokenService.verifyToken(accessToken);
    if (!payload) {
      throw new UnauthorizedException("The passed token is invalid");
    }
    const user = await this.userService.user({
      where: { id: payload.id },
    });
    if (!user) {
      throw new UnauthorizedException("The passed token is invalid");
    }
    return this.tokenService.createToken({
      id: user.id,
      phoneNumber: user.phoneNumber,
      password: user.password,
    });
  }

  async userInfo(id: string): Promise<UserInfo> {
    const user = await this.userService.user({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException("The passed token is invalid");
    }
    const { roles } = user;
    const roleList = roles as string[];
    return { id, phoneNumber: user.phoneNumber, firstName: user.firstName || '', 
    lastName: user.lastName||'', roles: roleList };
  }

  async createUserAuth(createUserArgs: RegisterArgs): Promise<UserCreated> {
    const dto = { data: {...createUserArgs.data, roles: ['user']} };
    if(await this.userService.user({where: {phoneNumber: createUserArgs.data.phoneNumber}})){
      throw new HttpException(
        'User with this phone number already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.createUser(dto);
    const { id, roles } = user;
    const roleList = roles as string[];
    roleList.push('user');
    return { id, phoneNumber: user.phoneNumber, message: "User created"};
  }
}
