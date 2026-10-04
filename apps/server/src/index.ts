// ┌─────────────────────────┐
// │ Base Imports            │
// └─────────────────────────┘
import { ApiResponse } from "@repo/shared";
import { errorHandlerMiddleware, requestLogger } from "./middlewares";
import { baseConfig } from "./config";
import { ExpressServer } from "./server";
import promClient from "@prometheus-io/client";
import { connectRedis, wwebClient } from "./libs";
import { container } from "./container";
import { ApiRouter } from "./routes";
import { mongoConnect } from "./libs/mongo.connect";

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
await mongoConnect();

/* -------------------------------------------------------------------------- */
/*                                 Rate Limiter                               */
/* -------------------------------------------------------------------------- */
await connectRedis();
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
/*                             Whatsapp client                                */
/* -------------------------------------------------------------------------- */

wwebClient.on("code", (code) => {
  console.log(`🔢 Your WhatsApp Pairing Code is: ${code}`);
});

// 3. ONLY TRIGGER IF AUTHENTICATION IS REQUIRED
wwebClient.on("qr", async () => {
  console.log(
    "No existing session found in database. Requesting pairing code..."
  );
  try {
    // Manually request the code only when the login screen is active
    const code = await wwebClient.requestPairingCode("8801950787553");
    console.log(`🔢 Requested Pairing Code: ${code}`);
  } catch (err) {
    console.error("Failed to request pairing code:", err);
  }
});

wwebClient.on("ready", () => {
  console.log("✅ Client is successfully connected and ready!");
});

wwebClient.on("remote_session_saved", () => {
  console.log(
    "💾 SUCCESS: Session has been successfully backed up to MongoDB!"
  );
  console.log("👉 It is now 100% safe to restart your server.");
});

wwebClient.on("auth_failure", (msg) => {
  console.error("❌ Authentication failure:", msg);
});

wwebClient
  .initialize()
  .catch((err) => console.error("initialize failed:", err));

process.on("unhandledRejection", (err) => console.error("unhandled:", err));
process.on("uncaughtException", (err) => console.error("uncaught:", err));

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
  // console.log(" Database: ", result.rows[0]!.now ? "Working ✅" : "ᶻ 𝗓 𐰁");
  // console.log(
  //   " Redis: ",
  //   (await redisClient.ping()) === "PONG" ? "Working ✅" : "ᶻ 𝗓 𐰁"
  // );
});
