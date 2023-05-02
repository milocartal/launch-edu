import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const leconRouter = createTRPCRouter({

    getAll: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
        return prisma.lecon.findMany({
            where: {
                idf: input.id
            },
        });
    }),

    getAll2: protectedProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
        return prisma.lecon.findMany({ where: { idf: input.id } });
    }),

    create: protectedProcedure.input(z.object({ title: z.string(), idf: z.string(), description: z.string() })).mutation(({ input }) => {
        return prisma.lecon.create({
            data: {
                title: input.title,
                idf: input.idf,
                description: input.description,
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.lecon.delete({ where: { id: input.id } })
    }),

    setHidden: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.lecon.update({
            where: {
                id: input.id,
            },
            data: {
                hidden: true,
            }
        })
    }),

    setVisible: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.lecon.update({
            where: {
                id: input.id,
            },
            data: {
                hidden: false,
            }
        })
    }),
});
