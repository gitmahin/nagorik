import { Container } from "inversify";
import { BloodService } from "./services";
import { BloodController } from "./controllers";
import { ApiRouter } from "./routes";
import { BloodRouter } from "./routes/blood.route";
import { BloodRedis } from "./redis";
import { BloodRepository } from "./database/repositories";
import { ChatRouter } from "./routes/chat.route";
import { ChatController } from "./controllers/chat.controller";

export const container: Container = new Container();

// Repositories
container.bind(BloodRepository).toSelf().inSingletonScope()

// Redis
container.bind(BloodRedis).toSelf().inSingletonScope();

// Service
container.bind(BloodService).toSelf().inSingletonScope();

// Controllers
container.bind(BloodController).toSelf().inSingletonScope();
container.bind(ChatController).toSelf().inSingletonScope();

// Routers
container.bind(BloodRouter).toSelf().inSingletonScope();
container.bind(ChatRouter).toSelf().inSingletonScope();
container.bind(ApiRouter).toSelf().inSingletonScope();
