import api from './index'
import { API_ROUTES } from './endpoints'
import type { Sensor } from '@/types/sensors'

export const sensorsService = {
  async getSensors(): Promise<Sensor[]> {
    try {
      const response = await api.get<Sensor[]>(API_ROUTES.SENSORS.GET)
      return response.data
    } catch (error) {
      console.error('Error fetching sensors:', error)
      throw error
    }
  },

  async createSensor(id: string, name: string): Promise<any> {
    try {
      const response = await api.post(API_ROUTES.SENSORS.GET, { id, name })
      return response.data
    } catch (error) {
      console.error('Error creating sensor:', error)
      throw error
    }
  },

  async deleteSensor(id: string): Promise<void> {
    try {
      await api.delete(API_ROUTES.SENSORS.DELETE(id))
    } catch (error) {
      console.error('Error deleting sensor:', error)
      throw error
    }
  },

  async updateSensorName(sensorId: string, name: string): Promise<number> {
    try {
      const response = await api.put(API_ROUTES.SENSORS.UPDATE_NAME, { sensorId, name })
      return response.status
    } catch (error) {
      console.error('Error updating sensor name:', error)
      throw error
    }
  },

  async addThreshold(
    sensorId: string,
    threshold: number,
    condition: string,
    type: string,
  ): Promise<any> {
    try {
      const response = await api.post(API_ROUTES.SENSORS.ADD_THRESHOLD, {
        sensorId,
        threshold,
        condition,
        type,
      })
      return response.data
    } catch (error) {
      console.error('Error adding threshold:', error)
      throw error
    }
  },
}
