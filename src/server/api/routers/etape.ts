import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const etapeRouter = createTRPCRouter({

    getAll: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
        return prisma.etape.findMany({ where: { idl: input.id } });
    }),

    create: protectedProcedure.input(z.object({ name: z.string(), idt: z.string(), code: z.string(), video: z.string(), transcript: z.string(), idl: z.string() })).mutation(({ input }) => {
        return prisma.etape.create({
            data: {
                name: input.name,
                idt: input.idt,
                transcript: input.transcript,
                code: input.code,
                video: input.video,
                idl: input.idl
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.etape.delete({ where: { id: input.id } })
    }),

    update: protectedProcedure.input(z.object({ id: z.string(), code: z.string(), video: z.string(), transcript: z.string() })).mutation(({ input }) => {
        return prisma.etape.update({
            where:{
                id: input.id
            },
            data: {
                transcript: input.transcript,
                code: input.code,
                video: input.video,
            }
        })
    }),

});
