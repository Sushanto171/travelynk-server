import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { CountryRoutes } from "../modules/country/country.routes";
import { InterestRoutes } from "../modules/interest/interest.routes";
import { PlanRoutes } from "../modules/plan/plan.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
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
]

routes.forEach(route => router.use(route.path, route.router))

export default router;