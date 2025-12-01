import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
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
]

routes.forEach(route => router.use(route.path, route.router))

export default router;