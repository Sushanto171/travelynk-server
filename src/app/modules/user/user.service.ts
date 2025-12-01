import { prisma } from "../../../config/prisma.config";
import { UserRole } from "../../../generated/prisma/enums";
import { BcryptHelper } from "../../helpers/bcrypt.helper";
import { createTravelerInput } from "./user.validation";

const getAllFromDB = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const createTraveler = async (payload: createTravelerInput) => {
  const hashedPassword = await BcryptHelper.generateHashPassword(payload.password)

  return await prisma.$transaction(async (tnx) => {
    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        role: UserRole.USER,
        email: payload.traveler.email
      }
    })

    return await tnx.traveler.create({
      data: {
        user_id: user.id,
        email: user.email,
        name: payload.traveler.name
      },
    })
  })


};

const createAdmin = async () => {
  const users = await prisma.user.findMany();
  return users;
};


export const UserService = {
  getAllFromDB,
  createTraveler,
  createAdmin,
}
