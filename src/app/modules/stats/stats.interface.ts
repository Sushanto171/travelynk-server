/* eslint-disable @typescript-eslint/no-explicit-any */

import { PlanStatus, PlanType, SubscriptionPlan } from "../../../generated/prisma/enums";

export interface UserStats {
  upcomingTrips: number,
  pendingRequests: number,
  recentCreatePlans: ITravelPlan[],
  subscriptionStatus: SubscriptionPlan | "FREE",
  recentNotifications?: any,
  matchedUsers?:IMatchedUser[]
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

export interface IMatchedUser  {
    matchPercentage: number;
    id: string;
    name: string;
    email: string;
    profile_photo: string | null;
    current_location: string | null;
  }