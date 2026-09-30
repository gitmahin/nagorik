import whatsappWeb from "whatsapp-web.js";
import mongoose from "mongoose";
import { MongoStore } from "wwebjs-mongo";
import { createReadStream } from "fs";
import os from "os";
import path, { basename } from "path";

const { Client, RemoteAuth } = whatsappWeb;

const CLIENT_ID = "main-session";

const baseStore = new MongoStore({ mongoose });

const store = Object.assign(Object.create(baseStore), {
  async save(options: { session: string }) {
    const name = basename(options.session);

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
      bucketName: `whatsapp-${name}`,
    });

    await new Promise<void>((resolve, reject) => {
      createReadStream(`${options.session}.zip`)
        .pipe(bucket.openUploadStream(`${name}.zip`))
        .on("error", reject)
        .on("close", resolve);
    });

    // keep only the newest backup
    const docs = await bucket.find({ filename: `${name}.zip` }).toArray();
    if (docs.length > 1) {
      const oldest = (docs as any[]).reduce((a, b) =>
        a.uploadDate < b.uploadDate ? a : b
      );
      await bucket.delete(oldest._id);
    }
  },
});

const chromePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  path.join(
    os.homedir(),
    ".cache/puppeteer/chrome/linux-154.0.8037.57/chrome-linux64/chrome"
  );

export const wwebClient = new Client({
  authStrategy: new RemoteAuth({
    clientId: CLIENT_ID,
    store,
    backupSyncIntervalMs: 300000,
  }),
  puppeteer: {
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  // keep this only if you still use the pairing-code flow
  // pairWithPhoneNumber: { phoneNumber: "8801612493125", showNotification: true },
});