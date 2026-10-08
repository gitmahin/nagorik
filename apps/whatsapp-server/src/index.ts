import { baseConfig } from "./config";
import promClient from "@prometheus-io/client";
import { wwebClient } from "./libs";
import { mongoConnect } from "./libs/mongo.connect";
import dns from "node:dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  await mongoConnect()
} catch (error) {}
 
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
    const code = await wwebClient.requestPairingCode("8801612493125");
    console.log(`🔢 Requested Pairing Code: ${code}`);
  } catch (err) {
    console.error("Failed to request pairing code:", err);
  }
});

wwebClient.on("ready", async () => {
  console.log("✅ Client is successfully connected and ready!");
  await wwebClient.sendPresenceAvailable();
});

wwebClient.on("remote_session_saved", () => {
  console.log(
    "💾 SUCCESS: Session has been successfully backed up to MongoDB!"
  );
  console.log("👉 It is now 100% safe to restart your server.");
});

wwebClient.on("message", async (message) => {
  const chat = await message.getChat()
  await chat.sendStateTyping()

 await new Promise(() => setTimeout( async() => {
   await message.reply("Message from WWeb.js! Testing")
 }, 2000))
 await chat.clearState()
});

wwebClient.on("disconnected", (reason) => console.error("WA disconnected:", reason));
wwebClient.on("auth_failure", (m) => console.error("WA auth failure:", m));

wwebClient
  .initialize()
  .catch((err) => console.error("initialize failed:", err));

process.on("unhandledRejection", (err) => console.error("unhandled:", err));
process.on("uncaughtException", (err) => console.error("uncaught:", err));
