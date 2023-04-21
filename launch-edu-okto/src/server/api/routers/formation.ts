import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const formationRouter = createTRPCRouter({

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.formation.findMany();
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
});
