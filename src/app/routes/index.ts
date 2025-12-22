import { Router } from "express";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { CountryRoutes } from "../modules/country/country.routes";
import { InterestRoutes } from "../modules/interest/interest.routes";
import { NewsLatterRoutes } from "../modules/newslatter/newslatter.routes";
import { PlanJoinRoutes } from "../modules/plan-join/plan-join.routes";
import { PlanRoutes } from "../modules/plan/plan.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { SubscriptionRoutes } from "../modules/subscription/subscription.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { TravelerRoutes } from './../modules/traveler/traveler.routes';

export const router = Router()

interface Route {
  path: string,
  router: Router
}

const routes: Route[] = [
  {
    path: "/user",
    router: UserRoutes,
  },
  {
    path: "/auth",
    router: AuthRoutes
  },
  {
    path: "/traveler",
    router: TravelerRoutes
  },
  {
    path: "/plan",
    router: PlanRoutes
  },
  {
    path: "/plan-join",
    router: PlanJoinRoutes
  },
  {
    path: "/review",
    router: ReviewRoutes
  },
  {
    path: "/country",
    router: CountryRoutes
  },
  {
    path: "/interest",
    router: InterestRoutes
  },
  {
    path: "/subscription",
    router: SubscriptionRoutes
  },
  {
    path: "/admin",
    router: AdminRoutes
  },
  {
    path: "/newslatter",
    router: NewsLatterRoutes
  },
]

routes.forEach(route => router.use(route.path, route.router))

export default router;