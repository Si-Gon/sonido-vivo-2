// Direccion unica de los servicios: el gateway reparte /api/** al microservicio que corresponde.
// Si se quiere ir directo a un servicio sin gateway, se cambia solo aca o en el repositorio
// correspondiente (catalogo 8091, mensajeria 8095).
export const API_GATEWAY = "http://localhost:8090";
