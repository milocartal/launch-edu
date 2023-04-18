import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const technologieRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Wesh ${input.text}`,
            };
        }),

    create: protectedProcedure.input(z.object({ name: z.string() })).mutation(({ input }) => {
        return prisma.technologie.create({
            data: { name: input.name }
        })
    }),

    delete: protectedProcedure.input(z.object({ name: z.string() })).mutation(({ input }) => {
        return prisma.technologie.deleteMany({ where: { name: input.name }, })
    }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.technologie.findMany();
    }),
});
