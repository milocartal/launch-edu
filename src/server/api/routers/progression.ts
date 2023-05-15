import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const progressionRouter = createTRPCRouter({

    getAll: publicProcedure.query(() => {
        return prisma.progression.findMany();
    }),

    getProgFormaUser: protectedProcedure.input(z.object({ idf: z.string(), idu: z.string() })).mutation(({ input }) => {
        return prisma.progression.findMany({
            where: {
                idF: input.idf,
                idU: input.idu
            }
        })
    }),

    getProgLecUser: protectedProcedure.input(z.object({ idl: z.string(), idu: z.string() })).query(({ input }) => {
        return prisma.progression.findMany({
            where: {
                idL: input.idl,
                idU: input.idu
            }
        })
    }),

    getOne: protectedProcedure.input(z.object({ idu: z.string(), idL: z.string(), idF: z.string() })).mutation(({ input }) => {
        return prisma.progression.findUnique({
            where: {
                idU_idL_idF: {
                    idU: input.idu,
                    idF: input.idF,
                    idL: input.idL,
                }

            }
        })
    }),

    create: protectedProcedure.input(z.object({ idu: z.string(), idL: z.string(), idF: z.string() })).mutation(({ input }) => {
        return prisma.progression.create({
            data: {
                idU: input.idu,
                idF: input.idF,
                idL: input.idL,
                started: true,
                finish: false
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ idu: z.string(), idL: z.string(), idF: z.string() })).mutation(({ input }) => {
        return prisma.progression.delete({
            where: {
                idU_idL_idF: {
                    idU: input.idu,
                    idL: input.idL,
                    idF: input.idF
                },
            }
        })
    }),

    setStarted: protectedProcedure.input(z.object({ idu: z.string(), idL: z.string(), idF: z.string() })).mutation(({ input }) => {
        return prisma.progression.update({
            where: {
                idU_idL_idF: {
                    idU: input.idu,
                    idL: input.idL,
                    idF: input.idF
                },
            },
            data: {
                started: true,
            }
        })
    }),

    setFinished: protectedProcedure.input(z.object({ idu: z.string(), idL: z.string(), idF: z.string() })).mutation(({ input }) => {
        return prisma.progression.update({
            where: {
                idU_idL_idF: {
                    idU: input.idu,
                    idL: input.idL,
                    idF: input.idF
                },
            },
            data: {
                finish: true,
            }
        })
    }),

    test: protectedProcedure.input(z.object({ idf: z.string(), idu: z.string() })).mutation(({ input }) => {
        return prisma.progression.count({
            where: {
                idF: input.idf,
                idU: input.idu,
                finish: true
            },
        })
    }),
});
