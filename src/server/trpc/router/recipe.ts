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
                include: {
                    uses: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            })
        }),
    addRecipe: protectedProcedure
        .input(z.object({
            name: z.string(),
            uses: z.array(z.string().cuid()).nullish()
        }))
        .mutation(({ ctx, input: { name, uses } }) => {
            return ctx.prisma.recipe.create({
                data: {
                    name: name,
                    User: {
                        connect: {
                            id: ctx.session.user.id
                        }
                    },
                    uses: {
                        connect: (uses) ? uses.map(id => ({ id })) : undefined
                    }
                }
            });
        }),
});