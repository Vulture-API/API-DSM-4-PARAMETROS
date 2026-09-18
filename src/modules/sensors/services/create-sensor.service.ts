import { SensorConflictError } from "@/modules/sensors/errors/sensor-conflict.error.js";
import type { SensorRepository } from "@/modules/sensors/repositories/sensor.repository.js";
import type { SensorInput } from "@/modules/sensors/schemas/sensor-input.schema.js";
import type { Sensor } from "@/modules/sensors/types/sensor.type.js";

export class CreateSensorService {
  constructor(private readonly sensorRepository: SensorRepository) {}

  async execute(input: SensorInput): Promise<Sensor> {
    const existing = await this.sensorRepository.findByStationAndIdentifier(
      input.station_id,
      input.local_identifier,
    );

    if (existing) {
      throw new SensorConflictError(
        "Sensor with this local identifier already exists on the specified station.",
      );
    }

    return this.sensorRepository.create(input);
  }
}
