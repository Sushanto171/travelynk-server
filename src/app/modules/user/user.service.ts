import { prisma } from "../../config/prisma.config";
import { BcryptHelper } from "../../helpers/bcrypt.helper";
import { Provider, UserRole, UserStatus } from ".././../../generated/prisma/enums";
import { createAdminInput, createTravelerInput } from "./user.validation";

const getAllFromDB = async () => {
  const users = await prisma.user.findMany(
    {
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
        admin: true,
        traveler: true,
      }
    }
  );
  return users;
};

const createTraveler = async (payload: createTravelerInput) => {
  const hashedPassword = await BcryptHelper.generateHashPassword(payload.password)

  return await prisma.$transaction(async (tnx) => {
    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        role: UserRole.USER,
        email: payload.traveler.email,
      }
    })

    // auths : {provider:"credentials"}[]
    const provider = await tnx.authProviders.create({
      data: {
        provider: Provider.CREDENTIALS
      }
    })

    await tnx.userAuthProviders.create({
      data: {
        auth_providersId: provider.id,
        user_id: user.id
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

const createAdmin = async (payload: createAdminInput) => {
  const hashedPassword = await BcryptHelper.generateHashPassword(payload.password)

  return await prisma.$transaction(async (tnx) => {
    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        role: UserRole.ADMIN,
        email: payload.admin.email,
      }
    })

    // auths : {provider:"credentials"}[]
    const provider = await tnx.authProviders.create({
      data: {
        provider: Provider.CREDENTIALS
      }
    })

    await tnx.userAuthProviders.create({
      data: {
        auth_providersId: provider.id,
        user_id: user.id
      }
    })


    return await tnx.admin.create({
      data: {
        user_id: user.id,
        email: user.email,
        name: payload.admin.name
      },
    })
  })
};

const changeProfileStatus = async (
  id: string,
  payload: {
    status: UserStatus;
  }
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: payload,
  });
  return result;
};

export const UserService = {
  getAllFromDB,
  createTraveler,
  createAdmin,
  changeProfileStatus
}
