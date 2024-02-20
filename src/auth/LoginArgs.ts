import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Credentials } from "./Credentials";
import { ApiProperty } from "@nestjs/swagger";
import { IsJSONValue } from "src/validators";
import GraphQLJSON from "graphql-type-json";
import { InputJsonValue } from "src/types";

@ArgsType()
export class LoginArgs {
  @Field(() => Credentials, { nullable: false })
  @Type(() => Credentials)
  @ValidateNested()
  credentials!: Credentials;
}
@InputType()
class UserCreateInputArg {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  firstName?: string | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  lastName?: string | null;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Field(() => String)
  password!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @Field(() => String)
  phoneNumber!: string;
}
@ArgsType()
export class RegisterArgs {
  @ApiProperty({
    required: true,
    type: () => UserCreateInputArg,
  })
  @ValidateNested()
  @Type(() => UserCreateInputArg)
  @Field(() => UserCreateInputArg, { nullable: false })
  data!: UserCreateInputArg;
}


