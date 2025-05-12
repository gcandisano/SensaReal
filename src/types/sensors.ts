export interface Sensor {
  id: string
  name: string
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

export interface SensorAlert {
  id: string
  userId: string
  sensorId: string
  thresholdValue: number
  actualValue: number
  condition: string
  type: 'temperature' | 'humidity'
  sentAt: string
  createdAt: string
  updatedAt: string
  sensor: {
    id: string
    name: string
  }
  user: {
    id: string
    name: string
    email: string
  }
}

export interface SensorAlertsResponse {
  count: number
  next: string | null
  previous: string | null
  results: SensorAlert[]
}
