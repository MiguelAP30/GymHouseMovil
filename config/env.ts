export const ENV = {
  development: {
    API_URL: 'https://apigymhouse.lat/api/v1',
  },
  production: {
    API_URL: 'https://apigymhouse.lat/api/v1', // Cambiar a la URL de producción cuando esté disponible
  },
  test: {
    API_URL: 'https://apigymhouse.lat/api/v1',
  },
};

// Por defecto usamos el entorno de desarrollo
export const getEnvironment = () => {
  return ENV.development;
}; 