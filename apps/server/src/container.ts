import { Container } from "inversify";
import { BloodService, WhatsappService } from "./services";
import { WhatsAppController } from "./controllers";
import { WhatsappRouter } from "./routes/whatsapp.route";
import { ApiRouter } from "./routes";
import { BloodController } from "./controllers/blood.controller";
import { BloodRouter } from "./routes/blood.route";

export const container: Container = new Container();

// Service
container.bind(WhatsappService).toSelf().inSingletonScope();
container.bind(BloodService).toSelf().inSingletonScope();

// Controllers
container.bind(WhatsAppController).toSelf().inSingletonScope();
container.bind(BloodController).toSelf().inSingletonScope();

// Routers
container.bind(WhatsappRouter).toSelf().inSingletonScope();
container.bind(BloodRouter).toSelf().inSingletonScope();
container.bind(ApiRouter).toSelf().inSingletonScope();
