import { envs } from './config/plugins/envs.js';
import {Server} from "./Server.js";
import {AppRouter} from "./routes/v1/app.routes.js";

// Función de arranque.
const main = async () => {
  const server = new Server({
    port: envs.PORT,
    routes: AppRouter.routes,
    acceptedOrigins: [],
  });

  await server.start();
}

// Inicialización.
(async () => {
  await main();
})();