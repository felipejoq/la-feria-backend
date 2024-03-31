import express from 'express';
import {CorsMiddleware} from "./middlewares/cors.middleware.js";

export class Server {
  constructor({port, routes, acceptedOrigins, publicPath = 'public'}) {
    this.app = express();
    this.port = port;
    this.publicPath = publicPath;
    this.routes = routes;
    this.acceptedOrigins = acceptedOrigins;
    this.serverListener = undefined;
  }

  async start() {
    //* Middlewares
    this.app.use(CorsMiddleware.corsAllow({acceptedOrigins: this.acceptedOrigins}))
    this.app.use(express.json()) // Texto plano raw
    this.app.use(express.urlencoded({extended: true}));
    this.app.disable('x-powered-by');

    // * Public folders
    this.app.use(express.static(this.publicPath));

    // * Routes
    this.app.use(this.routes);

    // * Wildcard route - SPA
    this.app.get('*', (req, res) => {
      res.redirect('/');
    });

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
    });

  }

  async close() {
    this.serverListener?.close();
  }
}