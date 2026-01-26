import express, { type Response } from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument } from "trpc-to-openapi";
import { appRouter } from "./server/index.ts";
import { createContext } from "./server/context.ts";

const app = express();
const PORT = 5000;

app.use(express.json());

const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "URL Shorten API",
  version: "1.0.0",
  baseUrl: "http://localhost:5000",
});

app.get("/", (_, res: Response) => {
  res
    .status(200)
    .json({ message: "Server is up and running!", status: "success" });
});

app.get("/openapi.json", (_, res: Response) => {
  return res.status(200).json(openApiDocument);
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
