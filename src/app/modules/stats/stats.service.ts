import { JwtPayload } from "jsonwebtoken";
import { RequestType, UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma.config";
import { calculateMatchPercentaged } from "../../utils/calculateMatchedPercentaged";
import { AdminStats, UserStats } from "./stats.interface";

const getStats = async (user: JwtPayload) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: { email: user.email },
    select: {
      role: true,
      admin: { select: { id: true, name: true } },
      traveler: {
        select: {
          id: true,
          name: true,
          email: true,
          interests: true,
          subscription_active: true,
        },
      },
    },
  });

  /**
   * ============================
   * ADMIN STATS
   * ============================
   */
  if (userData.role === UserRole.ADMIN) {
    const now = new Date();
    const last7Days = new Date(now);
    last7Days.setDate(now.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    const [
      totalUsers,
      totalPlans,
      totalSubscriptions,

      recentUsers,
      recentPlans,

      last7DaysNewUsers,
      last30DaysNewUsers,
      last7DaysNewPlans,
      last30DaysNewPlans,

      last7DaysSubscriptions,
      last30DaysSubscriptions,

      revenueAgg,
      revenue7Agg,
      revenue30Agg,

      planPie,
      subscriptionPie,
    ] = await Promise.all([
      prisma.traveler.count(),
      prisma.plan.count(),
      prisma.subscription.count(),

      prisma.traveler.findMany({
        orderBy: { created_at: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          profile_photo: true,
          created_at: true,
        },
      }),

      prisma.plan.findMany({
        orderBy: { created_at: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          tour_type: true,
          created_at: true,
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      }),

      prisma.traveler.count({ where: { created_at: { gte: last7Days } } }),
      prisma.traveler.count({ where: { created_at: { gte: last30Days } } }),

      prisma.plan.count({ where: { created_at: { gte: last7Days } } }),
      prisma.plan.count({ where: { created_at: { gte: last30Days } } }),

      prisma.subscription.count({ where: { created_at: { gte: last7Days } } }),
      prisma.subscription.count({ where: { created_at: { gte: last30Days } } }),

      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { created_at: { gte: last7Days } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { created_at: { gte: last30Days } },
      }),

      prisma.plan.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      prisma.subscription.groupBy({
        by: ["plan_type"],
        _count: { plan_type: true },
      }),
    ]);

    const adminStats: AdminStats = {
      totalUsers,
      totalPlans,
      totalSubscriptions,

      recentUsers,
      recentPlans,

      last7DaysNewUsers,
      last30DaysNewUsers,
      last7DaysNewPlans,
      last30DaysNewPlans,

      last7DaysSubscriptions,
      last30DaysSubscriptions,

      last7daysRevenue: Number(revenue7Agg._sum.amount || 0),
      last30daysRevenue: Number(revenue30Agg._sum.amount || 0),
      totalRevenue: Number(revenueAgg._sum.amount || 0),

      planPieChartData: planPie.map(p => ({
        status: p.status,
        count: p._count.status,
      })),

      subscriptionPieChartData: subscriptionPie.map(s => ({
        plan: s.plan_type ?? "FREE",
        count: s._count.plan_type,
      })),
    };

    return {
      role: UserRole.ADMIN,
      name: userData.admin?.name ?? "Admin",
      ...adminStats,
    };
  }

  /**
   * ============================
   * USER STATS
   * ============================
   */
  const stats: UserStats = {
    name: userData.traveler?.name || "User",
    recentCreatePlans: [],
    upcomingTrips: 0,
    pendingRequests: 0,
    subscriptionStatus: "FREE",
  };

  const travelerId = userData.traveler?.id;

  if (travelerId) {
    const [
      rawPlans,
      upcomingTrips,
      pendingRequests,
      subscriptionStatus,
    ] = await Promise.all([
      prisma.plan.findMany({
        where: { owner_id: travelerId },
        orderBy: { created_at: "desc" },
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
                where: { request_type: RequestType.ACCEPTED },
              },
            },
          },
        },
      }),

      prisma.plan.count({
        where: {
          OR: [
            { owner_id: travelerId },
            { buddies: { some: { traveler_id: travelerId } } },
          ],
          start_date: { gte: new Date() },
        },
      }),

      prisma.planBuddy.count({
        where: {
          plan: { owner_id: travelerId },
          request_type: RequestType.REQUESTED,
        },
      }),

      prisma.subscription.findFirst({
        where: { subscriber_id: travelerId },
        select: { plan_type: true },
      }),
    ]);

    stats.recentCreatePlans = rawPlans.map(({ _count, budget, ...r }) => ({
      ...r,
      budget:
        typeof budget === "object" && "toNumber" in budget
          ? budget.toNumber()
          : Number(budget),
      interestedTravelers: _count.buddies,
    }));

    stats.upcomingTrips = upcomingTrips;
    stats.pendingRequests = pendingRequests;
    stats.subscriptionStatus = subscriptionStatus?.plan_type ?? "FREE";
  }

  /**
   * ============================
   * MATCHED USERS (SUBSCRIBED)
   * ============================
   */
  if (userData.traveler?.subscription_active && travelerId) {
    const interestIds = userData.traveler.interests.map(i => i.interests_id);

    const users = await prisma.traveler.findMany({
      where: {
        id: { not: travelerId },
        interests: {
          some: { interests_id: { in: interestIds } },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        profile_photo: true,
        interests: true,
        current_location: true,
      },
    });

    stats.matchedUsers = users
      .map(({ interests, ...u }) => ({
        ...u,
        matchPercentage: calculateMatchPercentaged(
          interestIds,
          interests.map(i => i.interests_id)
        ),
      }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    stats.totalMatchedUsers = stats.matchedUsers.length;
  }

  return {
    role: UserRole.USER,
    ...stats,
  };
};

export const StatsService = {
  getStats,
};
