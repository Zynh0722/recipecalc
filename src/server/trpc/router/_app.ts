import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { recipeRouter } from "./recipe";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  recipe: recipeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
