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
