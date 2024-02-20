import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ImageModuleBase } from "./base/image.module.base";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { ImageResolver } from "./image.resolver";

@Module({
  imports: [ImageModuleBase, forwardRef(() => AuthModule)],
  controllers: [ImageController],
  providers: [ImageService, ImageResolver],
  exports: [ImageService],
})
export class ImageModule {}
