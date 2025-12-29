/* eslint-disable @typescript-eslint/no-explicit-any */

import { PlanStatus, PlanType, SubscriptionPlan } from "../../../generated/prisma/enums";

export interface UserStats {
  name: string,
  upcomingTrips: number,
  pendingRequests: number,
  recentCreatePlans: ITravelPlan[],
  subscriptionStatus: SubscriptionPlan | "FREE",
  recentNotifications?: any,
  // subscribe user matching only
  matchedUsers?: IMatchedUser[]
  totalMatchedUsers?: number
}


export interface ITravelPlan {
  interestedTravelers: number;
  status: PlanStatus;
  title: string;
  budget: number;
  start_date: Date;
  end_date: Date;
  tour_type: PlanType;
  slug: string
}

export interface IMatchedUser {
  matchPercentage: number;
  id: string;
  name: string;
  email: string;
  profile_photo: string | null;
  current_location: string | null;
}



// Admin Stats Interfaces

export interface AdminStats {
  totalUsers: number;
  totalPlans: number;
  totalSubscriptions: number;
  recentUsers: IAdminUser[];
  recentPlans: IAdminPlan[];
  last7DaysNewUsers: number;
  last7DaysNewPlans: number;
  last30DaysNewUsers: number;
  last30DaysNewPlans: number;
  last7DaysSubscriptions: number;
  last30DaysSubscriptions: number;
  last7daysRevenue: number;
  last30daysRevenue: number;
  totalRevenue: number;
  planPieChartData: { status: PlanStatus; count: number }[];
  subscriptionPieChartData: { plan: SubscriptionPlan | "FREE"; count: number }[];
}

export interface IAdminUser {
  id: string;
  name: string;
  email: string;
  profile_photo: string | null;
  created_at: Date;
}

export interface IAdminPlan {
  id: string;
  title: string;
  status: PlanStatus;
  tour_type: PlanType;
  created_at: Date;
  owner: {
    id: string;
    name: string;
    email: string;
  }
}