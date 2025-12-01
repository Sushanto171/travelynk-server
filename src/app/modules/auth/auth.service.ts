import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../../config/prisma.config"

const getMe = async (user: JwtPayload) => {

  return await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      is_deleted: false

    },
    select: {
      id: true,
      email: true,
      status: true,
      role: true,
      created_at: true,
      updated_at: true,
      admin: true,
      traveler: true,
      auths: {
        select: {
          auth_providers: true
        }
      }
    }
  })
}




export const AuthService = {
  getMe
}