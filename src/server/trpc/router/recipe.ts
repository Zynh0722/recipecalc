import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const recipeRouter = router({
    getRecipes: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.recipe.findMany({
                where: {
                    User: {
                        is: ctx.session.user
                    }
                },
                select: {
                    id: true,
                    name: true,
                    uses: {
                        select: {
                            quantity: true,
                            used: {
                                select: {
                                    name: true,
                                    id: true,
                                }
                            }
                        }
                    }
                }
            })
        }),
    getRecipe: protectedProcedure
        .input(z.string().cuid())
        .query(({ ctx, input: id }) => { 
            return ctx.prisma.recipe.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    uses: {
                        select: {
                            quantity: true,
                            used: {
                                select: {
                                    name: true,
                                    id: true,
                                }
                            }
                        },
                    }
                }
            }); 
        }),
    updateRecipe: protectedProcedure
        .input(z.object({
            id: z.string().cuid(),
            name: z.string().optional(),
        }))
        .mutation(({ ctx, input: { id, ...data } }) => {
            console.log(id, data)
            return ctx.prisma.recipe.update({
                where: { id },
                data
            });
        }),
    addUse: protectedProcedure
        .input(z.object({
            userId: z.string().cuid(),
            usedId: z.string().cuid(),
            quantity: z.number().int()
        }))
        .mutation(({ctx, input}) => {
            return ctx.prisma.recipeUses.create({
                data: { ...input }
            })
        }),
    removeUse: protectedProcedure
        .input(z.object({
            userId: z.string().cuid(),
            usedId: z.string().cuid(),
        }))
        .mutation(({ctx, input: userId_usedId}) => {
            return ctx.prisma.recipeUses.delete({
                where: { userId_usedId }
            })
        }),
    addRecipe: protectedProcedure
        .input(z.object({
            name: z.string(),
        }))
        .mutation(({ ctx, input: { name } }) => {
            return ctx.prisma.recipe.create({
                data: {
                    name,
                    userId: ctx.session.user.id
                }
            });
        }),
});