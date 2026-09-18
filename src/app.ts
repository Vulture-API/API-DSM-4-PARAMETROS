import "@/config/zod.config.js";

import cookie from "@fastify/cookie";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { handleError } from "@/errors/error-handler.js";
import { sensorTypeRoutes } from "@/modules/sensor-types/routes/sensor-types.route.js";
import { sensorRoutes } from "@/modules/sensors/routes/sensors.route.js";

export function buildApp() {
  const app = Fastify({
    logger: false,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(handleError);

  app.register(cookie);

  // Rotas conforme OpenAPI 1.3.0
  app.register(sensorTypeRoutes, { prefix: "/sensor-types" });
  app.register(sensorRoutes, { prefix: "/sensors" });

  // Prefixo /v1 conforme servers.url
  app.register(sensorTypeRoutes, { prefix: "/v1/sensor-types" });
  app.register(sensorRoutes, { prefix: "/v1/sensors" });

  return app;
}
