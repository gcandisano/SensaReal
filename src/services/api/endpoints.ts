export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    RESEND_VERIFICATION: '/auth/resend-verification',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  SENSORS: {
    GET: '/sensors',
    CREATE: '/sensors',
    DELETE: (id: string) => `/sensors/${id}`,
    UPDATE_NAME: '/sensors/name',
    ADD_THRESHOLD: '/sensor-thresholds',
    GET_SENSOR_DATA: (sensorId: string) => `/sensor-data/sensor/${sensorId}`,
    GET_THRESHOLDS: (sensorId: string) => `/sensor-thresholds/${sensorId}`,
    GET_ALERTS: (sensorId: string) => `/alerts/${sensorId}/alerts`,
  },
} as const
