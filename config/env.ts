export const ENV = {
  development: {
    API_URL: 'https://apigymhouse.lat/api/v1',
    //http://192.168.1.2:8000
    //192.168.1.1
    //http://192.168.80.14:8000
    //http://192.168.1.5:8000
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