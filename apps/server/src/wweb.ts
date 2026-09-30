import { Client, RemoteAuth } from "whatsapp-web.js";
import mongoose from "mongoose";
import { MongoStore } from "wwebjs-mongo";

export const StartWhatsAppClient = () => {
  const store = new MongoStore({ mongoose: mongoose });

  const client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000,
    }),
  });

  return client
};
