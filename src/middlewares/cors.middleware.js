import cors from 'cors';

export class CorsMiddleware {

  static corsAllow({ acceptedOrigins = [] }) {
    return cors({
      origin: (origin, callback) => {

        // Si el acceptedOrigins está vacío, no hay restricciones de cors.
        if (acceptedOrigins.length === 0) {
          return callback(null, true);
        }

        // Revisa si el origin está presente en acceptedOrigins
        if (acceptedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Caso de que no exista origin.
        if (!origin) {
          return callback(null, true);
        }

        // Cualquier otro caso se prohibe el acceso.
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    });
  }

}