import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";

export const router = Router()

interface Route {
  path: string,
  router: Router
}

const routes: Route[] = [{
  path: "/user",
  router: UserRoutes
}]

routes.forEach(route => router.use(route.path, route.router))

export default router;