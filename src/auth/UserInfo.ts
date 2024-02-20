import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../user/base/User";

@ObjectType()
export class UserInfo implements Partial<User> {
  @Field(() => String)
  id!: string;
  @Field(() => String)
  phoneNumber!: string;
  @Field(() => String)
  firstName!: string;
  @Field(() => String)
  lastName!: string;
  @Field(() => [String])
  roles!: string[];
  @Field(() => String, { nullable: true })
  accessToken?: string;
}

@ObjectType()
export class UserCreated {
  @Field(() => String)
  id!: string;
  @Field(() => String)
  phoneNumber!: string;
  @Field(() => String)
  message!: string;
}
