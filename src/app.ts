import "@/config/zod.config.js";

import cookie from "@fastify/cookie";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { handleError } from "@/errors/error-handler.js";
import { SensorTypeRepository } from "@/modules/sensor-types/repositories/sensor-type.repository.js";
import { sensorTypeRoutes } from "@/modules/sensor-types/routes/sensor-types.route.js";
import { SensorRepository } from "@/modules/sensors/repositories/sensor.repository.js";
import { sensorRoutes } from "@/modules/sensors/routes/sensors.route.js";

export function buildApp() {
  const app = Fastify({
    logger: false,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(handleError);

  app.register(cookie);

  const sensorTypeRepository = new SensorTypeRepository();
  const sensorRepository = new SensorRepository();

  app.register(sensorTypeRoutes, { prefix: "/sensor-types", repository: sensorTypeRepository });
  app.register(sensorRoutes, { prefix: "/sensors", repository: sensorRepository });

  app.register(sensorTypeRoutes, { prefix: "/v1/sensor-types", repository: sensorTypeRepository });
  app.register(sensorRoutes, { prefix: "/v1/sensors", repository: sensorRepository });

  app.register(sensorTypeRoutes, { prefix: "/api/sensor-types", repository: sensorTypeRepository });
  app.register(sensorRoutes, { prefix: "/api/sensors", repository: sensorRepository });

  app.register(sensorTypeRoutes, { prefix: "/api/v1/sensor-types", repository: sensorTypeRepository });
  app.register(sensorRoutes, { prefix: "/api/v1/sensors", repository: sensorRepository });

  app.get("/", async (_request, reply) => {
    return reply.status(200).send({
      name: "AgriTech - Parameters & Sensors Service",
      status: "ok",
    });
  });

  app.get("/health", async (_request, reply) => {
    return reply.status(200).send({
      status: "healthy",
    });
  });

  app.get("/api/v1/health", async (_request, reply) => {
    return reply.status(200).send({
      status: "healthy",
    });
  });

  return app;
}
