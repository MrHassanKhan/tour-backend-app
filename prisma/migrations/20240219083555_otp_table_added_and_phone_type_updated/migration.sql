-- CreateEnum
CREATE TYPE "UserCase" AS ENUM ('LOGIN', 'D2FA', 'E2FA', 'VPHONE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFA" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(5) NOT NULL,
    "useCase" "UserCase" NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
