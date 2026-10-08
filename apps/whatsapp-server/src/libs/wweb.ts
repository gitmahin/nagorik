import whatsappWeb from "whatsapp-web.js";

import mongoose from "mongoose";
import { MongoStore } from "wwebjs-mongo";
import { createReadStream, existsSync } from "fs";
import { rm } from "fs/promises";
import path, { basename } from "path";

const { Client, RemoteAuth, LocalAuth } = whatsappWeb;

const CLIENT_ID = "main-session";

const baseStore = new MongoStore({ mongoose }); 

// Custom save: handles stream errors and THROWS when the zip is missing,
// so remote_session_saved is never emitted for a backup that did not happen.
const store = Object.assign(Object.create(baseStore), {
  async save(options: { session: string }) {
    const zipPath = path.resolve(`${options.session}.zip`);

    // wait briefly in case the zip is still being written
    for (let i = 0; i < 10 && !existsSync(zipPath); i++) {
      await new Promise((r) => setTimeout(r, 500));
    }
    if (!existsSync(zipPath)) {
      throw new Error(`Backup zip missing: ${zipPath}`);
    }

    const name = basename(options.session);
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
      bucketName: `whatsapp-${name}`,
    });

    await new Promise<void>((resolve, reject) => {
      createReadStream(zipPath)
        .on("error", reject)
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

// storeRemoteSession exists at runtime but is missing from the type definitions
type RemoteAuthWithStore = InstanceType<typeof RemoteAuth> & {
  storeRemoteSession(options?: { emit?: boolean }): Promise<void>;
};

const authStrategy = new RemoteAuth({
  clientId: CLIENT_ID,
  store,
  backupSyncIntervalMs: 300000, // minimum allowed is 60000
}) as RemoteAuthWithStore;

const originalStoreRemoteSession = 
  authStrategy.storeRemoteSession.bind(authStrategy);

let backingUp = false;

// Single-flight guard: overlapping backups share the same zip and temp folder,
// and one deletes the files the other is still reading.
authStrategy.storeRemoteSession = async (options) => {
  if (backingUp) return;
  backingUp = true;
  try {
    // remove a leftover temp folder from a failed earlier run
    await rm(
      path.join(process.cwd(), ".wwebjs_auth", `wwebjs_temp_session_${CLIENT_ID}`),
      { recursive: true, force: true }
    );
    await originalStoreRemoteSession(options);
  } catch (err) {
    console.error("Backup failed, will retry next interval:", err);
  } finally {
    backingUp = false;
  }
};

export const wwebClient = new Client({
  authStrategy:
  process.env.NODE_ENV === "production"
    ? authStrategy                                   // RemoteAuth on your Linux server
    : new LocalAuth({ clientId: CLIENT_ID, dataPath: "./.wwebjs_auth" }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  // keep this only if you use the pairing-code flow
  // pairWithPhoneNumber: { phoneNumber: "8801612493125", showNotification: true },
});