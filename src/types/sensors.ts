export interface Sensor {
  id: string
  sensorId: string
  espId: string
  name: string
  status: 'ASSIGNED' | 'UNASSIGNED'
  lastReading: {
    temperature: number
    humidity: number
    timestamp: string
  }
}

export interface SensorThreshold {
  id: string
  sensorId: string
  userId: string
  type: string
  threshold: number
  condition: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  sensor: {
    id: string
    name: string
  }
}
