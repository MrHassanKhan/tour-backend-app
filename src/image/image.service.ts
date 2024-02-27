import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ImageServiceBase } from "./base/image.service.base";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ImageService extends ImageServiceBase {
  constructor(protected readonly prisma: PrismaService, protected readonly configService: ConfigService) {
    super(prisma, configService);
  }
}
