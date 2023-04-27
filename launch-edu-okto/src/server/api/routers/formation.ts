import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const formationRouter = createTRPCRouter({

    getAll: publicProcedure.query(() => {
        return prisma.formation.findMany({
            include: {
                techs: true,
                lecons: true,
            }
        })
    }),

    getLast4: publicProcedure.query(() => {
        return prisma.formation.findMany({
            include: {
                techs: true,
                lecons: true,
            },
            orderBy: {
                updatedAt: 'desc'
            },
            take: 4

        })
    }),

    getAllTech: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
        return prisma.formation.findMany({
            where: {
                techs: {
                    some: {
                        id: input.id
                    }
                }
            }
        });
    }),

    create: protectedProcedure.input(z.object({ title: z.string(), description: z.string(), difficulte: z.number(), techno: z.string() })).mutation(({ input }) => {
        return prisma.formation.create({
            data: {
                title: input.title,
                description: input.description,
                difficulte: input.difficulte,
                techs: {
                    connect: { id: input.techno }
                }
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.formation.delete({ where: { id: input.id } })
    }),

    getLecons: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.lecon.findMany({
            where: {
                idf: input.id
            }
        })
    }),
});
