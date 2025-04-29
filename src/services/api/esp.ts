import api from './index'
import { API_ROUTES } from './endpoints'

export const registerESP32 = async (espId: string) => {
  try {
    const response = await api.post(API_ROUTES.ESP.REGISTER, { espId })
    return response.data
  } catch (error) {
    console.error('Error al registrar ESP32:', error)
    throw error
  }
}
