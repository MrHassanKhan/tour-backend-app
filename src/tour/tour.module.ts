import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TourModuleBase } from "./base/tour.module.base";
import { TourService } from "./tour.service";
import { TourController } from "./tour.controller";
import { TourResolver } from "./tour.resolver";

@Module({
  imports: [TourModuleBase, forwardRef(() => AuthModule)],
  controllers: [TourController],
  providers: [TourService, TourResolver],
  exports: [TourService],
})
export class TourModule {}
