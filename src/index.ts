import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./server/index.ts";
import { createContext } from "./server/context.ts";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Server is up and running!", status: "success" });
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
