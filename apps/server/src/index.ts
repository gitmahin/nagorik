import { ApiResponse } from "@repo/shared";
import { errorHandlerMiddleware, requestLogger } from "./middlewares";
import { baseConfig } from "./config";
import { ExpressServer } from "./server";
import promClient from "@prometheus-io/client";
import { connectRedis } from "./libs";
import { container } from "./container";
import { ApiRouter } from "./routes";
import dns from "node:dns";

/* -------------------------------------------------------------------------- */
/*                                 Metrics                                    */
/* -------------------------------------------------------------------------- */
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

/* -------------------------------------------------------------------------- */
/*                               Create Server                                */
/* -------------------------------------------------------------------------- */
const server = new ExpressServer();
const app = server.GetApp();
app.use(requestLogger());
dns.setServers(["8.8.8.8", "1.1.1.1"]);
  
/* -------------------------------------------------------------------------- */
/*                                 Rate Limiter                               */
/* -------------------------------------------------------------------------- */
await connectRedis()
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 1000,
//   standardHeaders: "draft-8",
//   legacyHeaders: false,
//   ipv6Subnet: 56,
//   passOnStoreError: false,
//   skip: () => baseConfig.NODE_ENV === "test",
//   store: new RedisStore({
//     sendCommand: (...args: string[]) => redisClient.sendCommand(args),
//   }),
// });
// app.use(limiter);

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
const apiRouter = container.get(ApiRouter);
apiRouter.createRouters();
app.use("/api", apiRouter.getRouters());
app.get("/health", async (_, res) => {
  return res.status(200).json(new ApiResponse(200, "OK"));
});

app.get("/connect-whatsapp", (req, res) => {});

// app.get("/metrics", async (_req, res) => {
//   try {
//     res.set("Content-Type", register.contentType);
//     res.end(await register.metrics());
//   } catch (err) {
//     res.status(500).end(err);
//   }
// });

/* -------------------------------------------------------------------------- */
/*                          Error Handler Middleware                          */
/* -------------------------------------------------------------------------- */
app.use(errorHandlerMiddleware);

// Start Server
app.listen(baseConfig.PORT, async () => {
  // await mongoConnect()
  // const result = await pgDb.execute(sql`select now()`);
  console.log(`                                     
               █             ███          
 ██   █        █               █          
 ██░  █        █               █          
 █▒▓  █  ███   █▓██   █   █    █    ░███░ 
 █ █  █ ▓▓ ▒█  █▓ ▓█  █   █    █    █▒ ▒█ 
 █ ▓▓ █ █   █  █   █  █   █    █        █ 
 █  █ █ █████  █   █  █   █    █    ▒████ 
 █  ▓▒█ █      █   █  █   █    █    █▒  █ 
 █  ░██ ▓▓  █  █▓ ▓█  █▒ ▓█    █░   █░ ▓█ 
 █   ██  ███▒  █▓██   ▒██▒█    ▒██  ▒██▒█     
 Listening...                  Port: ${baseConfig.PORT}`);

});
