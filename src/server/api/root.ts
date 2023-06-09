import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { formationRouter } from "./routers/formation";
import { technologieRouter } from "./routers/tech";
import { typeRouter } from "./routers/type";
import { leconRouter } from "./routers/lecon";
import { etapeRouter } from "./routers/etape";
import { progressionRouter } from "./routers/progression";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  formation: formationRouter,
  technologie: technologieRouter,
  type: typeRouter,
  lecon: leconRouter,
  etape: etapeRouter,
  progression: progressionRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
