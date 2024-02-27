import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ImageModuleBase } from "./base/image.module.base";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { ImageResolver } from "./image.resolver";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [ImageModuleBase, forwardRef(() => AuthModule)],
  controllers: [ImageController],
  providers: [ImageService, ImageResolver],
  exports: [ImageService],
})
export class ImageModule {
  constructor( private readonly configService: ConfigService) {
    console.log('ImageModule', this.configService.get('AWS_REGION'));
  }
}
