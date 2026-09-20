import type { SensorType } from "@/modules/sensor-types/types/sensor-type.type.js";

export class SensorTypeRepository {
  private readonly sensorTypes: SensorType[] = [];
  private nextId = 1;

  async create(data: Omit<SensorType, "id">): Promise<SensorType> {
    const sensorType: SensorType = {
      id: this.nextId++,
      name: data.name,
      unit_of_measure: data.unit_of_measure,
      factor: data.factor ?? null,
      gain: data.gain ?? null,
    };

    this.sensorTypes.push(sensorType);
    return sensorType;
  }

  async findAll(): Promise<SensorType[]> {
    return [...this.sensorTypes];
  }

  async findById(id: number): Promise<SensorType | null> {
    const found = this.sensorTypes.find((item) => item.id === id);
    return found ? { ...found } : null;
  }

  async findByName(name: string): Promise<SensorType | null> {
    const found = this.sensorTypes.find(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );
    return found ? { ...found } : null;
  }

  async update(id: number, data: Partial<Omit<SensorType, "id">>): Promise<SensorType | null> {
    const index = this.sensorTypes.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }

    const current = this.sensorTypes[index]!;
    const updated: SensorType = {
      id: current.id,
      name: data.name ?? current.name,
      unit_of_measure: data.unit_of_measure ?? current.unit_of_measure,
      factor: data.factor !== undefined ? data.factor : current.factor,
      gain: data.gain !== undefined ? data.gain : current.gain,
    };

    this.sensorTypes[index] = updated;
    return { ...updated };
  }

  async delete(id: number): Promise<boolean> {
    const index = this.sensorTypes.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    this.sensorTypes.splice(index, 1);
    return true;
  }
}
