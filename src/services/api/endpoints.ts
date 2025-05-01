import api from './index'

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  ESP: {
    REGISTER: '/esp/register',
  },
  SENSORS: {
    GET: '/sensors',
    DELETE: (id: string) => `/sensors/${id}`,
    UPDATE_NAME: '/esp/sensors/name',
    ADD_THRESHOLD: '/sensor-thresholds',
    GET_SENSOR_DATA: (sensorId: string) => `/sensor-data/sensor/${sensorId}`,
  },
} as const
