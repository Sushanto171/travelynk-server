/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "../../config"
import { prisma } from "../../config/prisma.config"
import { Provider, UserRole } from "../../generated/prisma/enums"
import { ApiError } from "../helpers/ApiError"
import { BcryptHelper } from "../helpers/bcrypt.helper"

export const seeAdmin = async () => {
  try {

    const hashedPassword = await BcryptHelper.generateHashPassword(config.seedAdmin.SEED_ADMIN_PASSWORD as string)

    const { email, name } = {
      name: config.seedAdmin.SEED_ADMIN_NAME as string,
      email: config.seedAdmin.SEED_ADMIN_EMAIL as string,
    }

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        role: UserRole.ADMIN,
        password: hashedPassword,
        email,
        admin: {
          create: {
            email, name,

          }
        },
        auths: {
          create: {
            auth_providers: {
              create: {
                provider: Provider.CREDENTIALS
              }
            }
          }
        }
      },
      update: {}
    })

    console.log("🍴 Admin user seeded:", user.email);

  } catch (error: any) {
    throw new ApiError(500, error.message)
  }
}