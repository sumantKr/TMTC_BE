import "reflect-metadata";
import App from "./App";
import { ItineraryController } from "./controllers/itinerary/itinerary.controller";
import { UserController } from "./controllers/user/user.controller";

const app = new App([new UserController(), new ItineraryController()]);

app.listen();
