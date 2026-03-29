import { Hono } from "hono";
import { cors } from "hono/cors";
import { compress } from "hono/compress";
import { logger } from "hono/logger";
import urlsRouter from "./routes/urls.route";

// create the hono application
const app = new Hono().basePath("/api");

// apply middleware
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: [],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: [],
    maxAge: 600,
    credentials: false,
  }),
);
app.use(compress({ encoding: "gzip" }));
app.use(logger());

app.route("/", urlsRouter);

export default app;
