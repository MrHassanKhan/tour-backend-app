import { PrismaClient } from "@prisma/client";

export async function customSeed() {
  const client = new PrismaClient();
  // const phoneNumber = +923139993826;

  // //replace this sample code to populate your database
  // //with data that is required for your service to start
  // await client.user.update({
  //   where: { phoneNumber: phoneNumber },
  //   data: {
  //     phoneNumber,
  //   },
  // });

  client.$disconnect();
}
