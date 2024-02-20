import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TourServiceBase } from "./base/tour.service.base";

@Injectable()
export class TourService extends TourServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
