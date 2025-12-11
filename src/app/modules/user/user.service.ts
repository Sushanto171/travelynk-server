/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const getUserById = async (id: string) => {
  const raw = await prisma.user.findFirst({
    where: {
      is_deleted: false,
      OR: [
        { id },
        { traveler: { id } },
        { admin: { id } },
      ],
    },
    select: {
      id: true,
      email: true,
      status: true,
      role: true,
      is_verified: true,
      created_at: true,
      updated_at: true,
      admin: true,

      traveler: {
        include: {
          interests: {
            select: {
              interests: {
                select: { id: true, name: true },
              },
            },
          },
          visited_countries: {
            select: {
              country: {
                select: { id: true, name: true, code: true },
              },
            },
          },
        },
      },

      auths: {
        select: {
          auth_providers: true,
        },
      },
    },
  });


  if (!raw) {
    throw new Error("User not found");
  }

  // ---------------------------------
  // Normalize Traveler
  // ---------------------------------
  let traveler

  if (raw.traveler) {
    const interests = raw.traveler.interests.map(
      (i: any) => i.interests
    );

    const visitedCountries =
      raw.traveler.visited_countries.map((c: any) => c.country);

    traveler = {
      ...raw.traveler,
      interests,
      visited_countries: visitedCountries,
    };
  }

  // ---------------------------------
  // Return Clean IUser Format
  // ---------------------------------
  const result = {
    id: raw.id,
    email: raw.email,
    status: raw.status,
    role: raw.role,
    is_verified: raw.is_verified,
    created_at: raw.created_at,
    updated_at: raw.updated_at,

    admin: raw.admin || undefined,
    traveler: traveler || undefined,

    auths: raw.auths,
  };

  return result;
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
  getUserById,
  createTraveler,
  createAdmin,
  changeProfileStatus
}
