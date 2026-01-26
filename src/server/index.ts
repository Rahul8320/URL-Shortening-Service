import { router } from "./trpc.ts";
import { shortenRouter } from "./routes/shorten.routes.ts";

export const appRouter = router({
  shorten: shortenRouter,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
