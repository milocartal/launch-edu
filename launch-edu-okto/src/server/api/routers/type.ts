import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const typeRouter = createTRPCRouter({

    create: protectedProcedure.input(z.object({ name: z.string() })).mutation(({ input }) => {
        return prisma.etapeType.create({
            data: { name: input.name }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.etapeType.delete({ where: { id: input.id }, })
    }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.etapeType.findMany();
    }),
});
