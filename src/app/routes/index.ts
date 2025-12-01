import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
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
  },{
    path:"/traveler",
    router: TravelerRoutes
  }
]

routes.forEach(route => router.use(route.path, route.router))

export default router;