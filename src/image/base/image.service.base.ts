/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";

import {
  Prisma,
  Image,
  User,
  Tour,
} from "@prisma/client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { UploadImageResponse } from "./UploadImageResponse";
import { ImageFolderType } from "./ImageType.enum";

export class ImageServiceBase {
  private readonly s3Client: S3Client;
  constructor(protected readonly prisma: PrismaService, 
    protected readonly configService: ConfigService) {
      this.s3Client = new S3Client({ 
        region: this.configService.getOrThrow('AWS_REGION'),
        credentials: {
          accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
          secretAccessKey: this.configService.getOrThrow('AWS_SECRET'),
        }
      });
  }

  async uploadImage(file: Express.Multer.File, userId: string, type: ImageFolderType): Promise<UploadImageResponse> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileKeyName = `${userId}/${type}/${Date.now()}-${file.originalname}`;
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
      Key: fileKeyName,
      ACL: 'public-read',
      Body: file.buffer,
      ContentType: file.mimetype
    }));
    const imageUrl = `https://${this.configService.getOrThrow('AWS_BUCKET_NAME')}.s3.${this.configService.getOrThrow('AWS_REGION')}.amazonaws.com/${fileKeyName}`;
    return await this.prisma.image.create({
      data: {
        url: imageUrl,
      },
      select: {
        id: true,
        url: true,
      }
    });
  }

  async uploadImages(files: Express.Multer.File[], userId: string, type: ImageFolderType): Promise<UploadImageResponse[]> {
    const uploadedImages: UploadImageResponse[] = [];
    for await (const file of files) {
      uploadedImages.push(await this.uploadImage(file, userId, type));
    }
    return uploadedImages;
  }
  async count<T extends Prisma.ImageCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.ImageCountArgs>
  ): Promise<number> {
    return this.prisma.image.count(args);
  }

  async images<T extends Prisma.ImageFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.ImageFindManyArgs>
  ): Promise<Image[]> {
    return this.prisma.image.findMany(args);
  }
  async image<T extends Prisma.ImageFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.ImageFindUniqueArgs>
  ): Promise<Image | null> {
    return this.prisma.image.findUnique(args);
  }
  async createImage<T extends Prisma.ImageCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ImageCreateArgs>
  ): Promise<Image> {
    return this.prisma.image.create<T>(args);
  }
  async updateImage<T extends Prisma.ImageUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ImageUpdateArgs>
  ): Promise<Image> {
    return this.prisma.image.update<T>(args);
  }
  async deleteImage<T extends Prisma.ImageDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.ImageDeleteArgs>
  ): Promise<Image> {
    return this.prisma.image.delete(args);
  }

  async findUsers(
    parentId: string,
    args: Prisma.UserFindManyArgs
  ): Promise<User[]> {
    return this.prisma.image
      .findUniqueOrThrow({
        where: { id: parentId },
      })
      .users(args);
  }

  async getTour(parentId: string): Promise<Tour | null> {
    return this.prisma.image
      .findUnique({
        where: { id: parentId },
      })
      .tour();
  }
}
