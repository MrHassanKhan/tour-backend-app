import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IAuthStrategy } from "../../IAuthStrategy";
import { UserInfo } from "../../UserInfo";
import { UserService } from "../../../user/user.service";

export class JwtStrategyBase
  extends PassportStrategy(Strategy)
  implements IAuthStrategy
{
  constructor(
    protected readonly secretOrKey: string,
    protected readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: UserInfo): Promise<UserInfo> {
    const { phoneNumber } = payload;
    const user = await this.userService.user({
      where: { phoneNumber },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (
      !Array.isArray(user.roles) ||
      typeof user.roles !== "object" ||
      user.roles === null
    ) {
      throw new Error("User roles is not a valid value");
    }
    return { ...user, firstName: user.firstName || '', 
    lastName: user.lastName||'', roles: user.roles as string[] };
  }
}
