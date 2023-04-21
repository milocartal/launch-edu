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

    create: protectedProcedure.input(z.object({ name: z.string(), idt: z.string(), description: z.string(), code: z.string(), idl: z.string() })).mutation(({ input }) => {
        return prisma.etape.create({
            data: {
                name: input.name,
                idt: input.idt,
                description: input.description,
                code: input.code,
                idl: input.idl
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.etape.delete({ where: { id: input.id } })
    }),

});