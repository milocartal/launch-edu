import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const technologieRouter = createTRPCRouter({

    create: protectedProcedure.input(z.object({ name: z.string(), url: z.string()})).mutation(({ input }) => {
        return prisma.technologie.create({
            data: { name: input.name, logo: input.url }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.technologie.delete({ where: { id: input.id }, })
    }),

    getAll: publicProcedure.query(({ ctx }) => {
        return prisma.technologie.findMany();
    }),
});
