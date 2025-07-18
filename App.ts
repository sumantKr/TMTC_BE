import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import morgan from "morgan";
import { API_VERSION, CORS_ORIGIN, DB_PATH, PORT } from "./constants/env_variables";
import errorMiddleware from "./middleware/ErrorHandler.middleware";
import cors from "cors";
import { IController } from "./common/controller.types";
import mongoose from "mongoose";
import ErrorResponse from "./common/ErrorResponse";
import { StatusCodes } from "http-status-codes";
class App {
  public app: Application;
  public port: number;
  constructor(controllers: IController[]) {
    this.app = express();
    this.port = PORT;

    this.connectToTheDatabase();
    this.initializeMiddleWares();
    this.initializeControllers(controllers);
    this.initializeNotFoundHandler();
    this.initializeErrorHandler();
  }
  initializeErrorHandler() {
    this.app.use(errorMiddleware);
  }
  private async connectToTheDatabase() {
    if (!DB_PATH) {
      console.error("❌ MONGO_URI is not defined");
      process.exit(1);
    }
    await mongoose.connect(DB_PATH, {});
    console.log("✅ Connected to MongoDB");
  }
  catch(err: any) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }

  private initializeMiddleWares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser(["_ac_jwt"]));
    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
  }

  private initializeControllers(controllers: IController[]) {
    controllers.forEach((controller: IController) => {
      console.debug(`${API_VERSION}/${controller.path}`);
      this.app.use(`${API_VERSION}/${controller.path}`, controller.router);
    });
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🌋 | App listening on the port ${this.port}`);
    });
  }
  private initializeNotFoundHandler() {
    this.app.use((req, res, next) => {
      next(
        new ErrorResponse({
          status: StatusCodes.NOT_FOUND,
          message: "Not Found - The requested resource does not exist",
        })
      );
    });
  }
}

export default App;
