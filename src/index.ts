import { Hono } from "hono";

import { logger } from "hono/logger";

import urlsRouter from "./routes/urls.route";

const app = new Hono().basePath("/api");
app.use(logger());

app.route("/", urlsRouter);

export default app;
