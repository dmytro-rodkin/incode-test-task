import express, { Application } from "express";
import Controller from "./controllers/Controller";

class App {
  public app: Application;
  private readonly port: number;
  private readonly controllers: Controller[];
  public constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;
    this.controllers = controllers;
    this.initializeMiddlewares();
    this.initializeControllers();
  }
  public listen = () => {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  };
  private initializeMiddlewares = () => {
    this.app.use(express.json());
  };

  private initializeControllers = () => {
    this.controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  };
}

export default App;
