export const ENV = {
  development: {
    API_URL: 'http://0.0.0.0:8000/api/v1',
  },
  production: {
    API_URL: 'http://192.168.80.14:8000/api/v1', // Cambiar a la URL de producción cuando esté disponible
  },
  test: {
    API_URL: 'http://localhost:8000/api/v1',
  },
};

// Por defecto usamos el entorno de desarrollo
export const getEnvironment = () => {
  return ENV.development;
}; 