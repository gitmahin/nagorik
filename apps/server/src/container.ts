import { Container } from "inversify";
import { WhatsappService } from "./services";
import { WhatsAppController } from "./controllers";
import { WhatsappRouter } from "./routes/whatsapp.route";
import { ApiRouter } from "./routes";

export const container: Container = new Container();

// Service
container.bind(WhatsappService).toSelf().inSingletonScope()

// Controllers
container.bind(WhatsAppController).toSelf().inSingletonScope()

// Routers
container.bind(WhatsappRouter).toSelf().inSingletonScope()
container.bind(ApiRouter).toSelf().inSingletonScope()

