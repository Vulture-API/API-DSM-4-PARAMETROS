import type { PaginatedResult } from "@/common/pagination.schema.js";
import type { Sensor } from "@/modules/sensors/types/sensor.type.js";

export interface SensorFilter {
  page?: number | undefined;
  limit?: number | undefined;
  station_id?: number | undefined;
}

export interface SensorUpdateData {
  station_id?: number | undefined;
  sensor_type_id?: number | undefined;
  local_identifier?: string | undefined;
  operational_status?: boolean | undefined;
}

export class SensorRepository {
  private readonly sensors: Sensor[] = [];
  private nextId = 1;

  async create(data: Omit<Sensor, "id" | "created_at">): Promise<Sensor> {
    const sensor: Sensor = {
      id: this.nextId++,
      station_id: data.station_id,
      sensor_type_id: data.sensor_type_id,
      local_identifier: data.local_identifier,
      operational_status: data.operational_status,
      created_at: new Date().toISOString(),
    };

    this.sensors.push(sensor);
    return sensor;
  }

  async findPaginated(
    filter?: SensorFilter | undefined,
  ): Promise<PaginatedResult<Sensor>> {
    const page = filter?.page ?? 1;
    const limit = filter?.limit ?? 20;

    let filtered = [...this.sensors];
    if (filter?.station_id !== undefined) {
      filtered = filtered.filter((s) => s.station_id === filter.station_id);
    }

    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
      data,
      meta: {
        total_records: totalRecords,
        total_pages: totalPages,
        current_page: page,
      },
    };
  }

  async findById(id: number): Promise<Sensor | null> {
    const found = this.sensors.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  async findByStationAndIdentifier(
    stationId: number,
    localIdentifier: string,
  ): Promise<Sensor | null> {
    const found = this.sensors.find(
      (s) =>
        s.station_id === stationId &&
        s.local_identifier.toLowerCase() === localIdentifier.toLowerCase(),
    );
    return found ? { ...found } : null;
  }

  async countBySensorTypeId(sensorTypeId: number): Promise<number> {
    return this.sensors.filter((s) => s.sensor_type_id === sensorTypeId).length;
  }

  async update(id: number, data: SensorUpdateData): Promise<Sensor | null> {
    const index = this.sensors.findIndex((s) => s.id === id);
    if (index === -1) {
      return null;
    }

    const current = this.sensors[index]!;
    const updated: Sensor = {
      id: current.id,
      station_id: data.station_id ?? current.station_id,
      sensor_type_id: data.sensor_type_id ?? current.sensor_type_id,
      local_identifier: data.local_identifier ?? current.local_identifier,
      operational_status:
        data.operational_status !== undefined
          ? data.operational_status
          : current.operational_status,
      created_at: current.created_at,
    };

    this.sensors[index] = updated;
    return { ...updated };
  }

  async delete(id: number): Promise<boolean> {
    const index = this.sensors.findIndex((s) => s.id === id);
    if (index === -1) {
      return false;
    }

    this.sensors.splice(index, 1);
    return true;
  }
}
