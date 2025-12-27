import { JwtPayload } from "jsonwebtoken"
import { RequestType, UserRole } from "../../../generated/prisma/enums"
import { prisma } from "../../config/prisma.config"
import { calculateMatchPercentaged } from "../../utils/calculateMatchedPercentaged"
import { ITravelPlan, UserStats } from "./stats.interface"

const getStats = async (user: JwtPayload) => {

  const userData = await prisma.traveler.findUniqueOrThrow({
    where: {
      email: user.email
    },
    select: {
      id: true,
      name: true,
      email: true,
      interests: true,
      subscription_active: true,
      user: {
        select: {
          role: true
        }
      }
    }
  })

  let stats: UserStats = {
    name: userData.name || "User",
    recentCreatePlans: [],
    upcomingTrips: 0,
    pendingRequests: 0,
    subscriptionStatus: "FREE"
  }

  // for user
  if (userData.user.role === UserRole.USER) {
    const recentPlansPromise = prisma.plan.findMany({
      where: {
        owner_id: userData.id
      },
      orderBy: {
        created_at: "desc"
      },
      take: 3,
      select: {
        title: true,
        status: true,
        budget: true,
        tour_type: true,
        start_date: true,
        end_date: true,
        slug: true,
        _count: {
          select: {
            buddies: {
              where: {
                request_type: RequestType.ACCEPTED
              }
            }
          }
        }
      }
    })

    const upcomingTripsPromise = prisma.plan.count({
      where: {
        OR: [{ owner_id: userData.id }, { buddies: { some: { traveler_id: userData.id } } }]
        ,
        start_date: {
          gte: new Date()
        }
      }
    })

    const pendingRequestsPromise = prisma.planBuddy.count({
      where: {
        plan: {
          owner_id: userData.id,
        },
        request_type: RequestType.REQUESTED
      }
    })

    const subscriptionStatusPromise = prisma.subscription.findFirst(
      {
        where: {
          subscriber_id: userData.id
        },
        select: {
          plan_type: true
        }
      }
    )

    const [rawPlans, upcomingTrips, pendingRequests, subscriptionStatus] = await Promise.all([recentPlansPromise, upcomingTripsPromise, pendingRequestsPromise, subscriptionStatusPromise]);

    const recentPlans: ITravelPlan[] = rawPlans.map((({ _count, budget, ...r }) => ({
      ...r,
      budget: typeof budget === "object" && "toNumber" in budget ? budget.toNumber() : Number(budget),
      interestedTravelers: _count.buddies as number
    })));


    stats = {
      ...stats,
      recentCreatePlans: recentPlans,
      upcomingTrips,
      pendingRequests,
      subscriptionStatus: subscriptionStatus ? subscriptionStatus.plan_type : "FREE"
    }
  }

  // subscribe user matching only
  if (userData.subscription_active) {
    const interestIds = userData.interests.map(i => i.interests_id)
    const users = await prisma.traveler.findMany({
      where: {
        id: {
          not: userData.id
        },
        interests: {
          some: {
            interests_id: {
              in: interestIds
            }
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        profile_photo: true,
        interests: true,
        current_location: true
      }
    })

    stats.matchedUsers = users
      .map(({ interests, ...user }) => {
        const userInterestIds = interests.map(i => i.interests_id)

        return {
          ...user,
          matchPercentage: calculateMatchPercentaged(
            interestIds,
            userInterestIds
          ),
        }
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage)

    stats.totalMatchedUsers = stats.matchedUsers.length
  }

  return stats;
}


export const StatsService = {
  getStats
}