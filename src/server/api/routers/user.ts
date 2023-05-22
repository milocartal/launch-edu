import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getAdmin: protectedProcedure.query(() => {
    return prisma.user.findMany({ where: { admin: true } })
  }),

  setAdmin: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    return prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        admin: true,
      }
    })
  }),

  unSetAdmin: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    return prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        admin: false,
      }
    })
  }),
});
