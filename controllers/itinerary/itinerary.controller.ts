import { Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { IController } from "../../common/controller.types";
import ErrorResponse from "../../common/ErrorResponse";
import { IUserRequest } from "../../common/request.types";
import SuccessResponse from "../../common/SuccessResponse";
import { authMiddleware } from "../../middleware/auth.middleware";
import catchAsync from "../../middleware/catchAsync";
import validationMiddleware from "../../middleware/validation.middleware";
import {
  CreateItineraryDto,
  ItineraryParamsDto,
  UpdateItineraryDto,
} from "./itinerary.dto";
import ItineraryService from "./itinerary.service";
import {
  DateRangePaginationDto,
  PaginatedQueryDto,
} from "../../common/pagination";

export class ItineraryController implements IController {
  path = "itinerary";
  router = Router();
  private itineraryService = new ItineraryService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);
    this.router.post(
      "/",
      validationMiddleware(CreateItineraryDto),
      catchAsync(this.create.bind(this))
    );

    this.router.get(
      "/calendar",
      validationMiddleware(DateRangePaginationDto, "query"),
      catchAsync(this.calendarView.bind(this))
    );
    this.router.get(
      "/list",
      validationMiddleware(PaginatedQueryDto, "query"),
      catchAsync(this.list.bind(this))
    );

    this.router.put(
      "/:itineraryId",
      validationMiddleware(UpdateItineraryDto),
      validationMiddleware(ItineraryParamsDto, "params"),
      catchAsync(this.update.bind(this))
    );

    this.router.delete(
      "/:itineraryId",
      validationMiddleware(ItineraryParamsDto, "params"),
      catchAsync(this.delete.bind(this))
    );
  }

  private async create(
    req: IUserRequest<{}, {}, CreateItineraryDto>,
    res: Response
  ) {
    const { endDate, startDate } = req.body;
    const userId = req.user!._id;
    if (startDate > endDate) {
      throw new ErrorResponse({
        message: "Start date must be less than end date!",
        status: StatusCodes.BAD_REQUEST,
      });
    }
    const isBlocked = await this.itineraryService.isValidItinerary(
      userId,
      startDate,
      endDate
    );
    if (isBlocked !== 0) {
      throw new ErrorResponse({
        message: "Dates are booked!",
        status: StatusCodes.CONFLICT,
      });
    }
    const itinerary = await this.itineraryService.create(userId, req.body);
    return res.status(StatusCodes.CREATED).send(
      new SuccessResponse({
        status: StatusCodes.CREATED,
        message: "Itinerary created successfully",
        data: itinerary,
      })
    );
  }

  private async calendarView(
    request: IUserRequest<{}, {}, {}, DateRangePaginationDto>,
    res: Response
  ) {
    const userId = request.user!._id;
    const { endDate, startDate } = request.query;
    const itineraries = await this.itineraryService.listUserCalendar(
      userId,
      startDate,
      endDate
    );
    return res.send(
      new SuccessResponse({
        message: "Itineraries fetched successfully",
        data: itineraries,
        status: StatusCodes.OK,
      })
    );
  }
  private async list(
    request: IUserRequest<{}, {}, {}, PaginatedQueryDto>,
    res: Response
  ) {
    const userId = request.user!._id;
    const { limit, page } = request.query;
    const itineraries = await this.itineraryService.listUserItinerary(
      userId,
      Number(page),
      Number(limit)
    );
    return res.send(
      new SuccessResponse({
        message: "Itineraries fetched successfully",
        data: itineraries,
        status: StatusCodes.OK,
      })
    );
  }

  private async update(
    req: IUserRequest<ItineraryParamsDto, {}, UpdateItineraryDto>,
    res: Response
  ) {
    const { startDate, endDate } = req.body;
    const userId = req.user!._id;
    const itineraryId = req.params.itineraryId;
    if (startDate > endDate) {
      throw new ErrorResponse({
        message: "Start date must be less than end date!",
        status: StatusCodes.BAD_REQUEST,
      });
    }
    const [foundItinerary, isBlocked] = await Promise.all([
      this.itineraryService.findById(userId, itineraryId),
      this.itineraryService.isValidItinerary(
        userId,
        startDate,
        endDate,
        itineraryId
      ),
    ]);
    if (!foundItinerary) {
      throw new ErrorResponse({
        status: StatusCodes.NOT_FOUND,
        message: "Itinerary not found",
      });
    }
    if (isBlocked !== 0) {
      throw new ErrorResponse({
        message: "Dates are booked!",
        status: StatusCodes.CONFLICT,
      });
    }
    const updated = await this.itineraryService.update(
      itineraryId,
      userId,
      req.body
    );
    return res.send(
      new SuccessResponse({
        message: "Itinerary updated",
        data: updated,
        status: StatusCodes.OK,
      })
    );
  }

  private async delete(
    req: IUserRequest<ItineraryParamsDto, {}>,
    res: Response
  ) {
    const userId = req.user!._id;
    const itineraryId = req.params.itineraryId;
    const foundItinerary = await this.itineraryService.findById(
      userId,
      itineraryId
    );

    if (!foundItinerary) {
      throw new ErrorResponse({
        status: StatusCodes.NOT_FOUND,
        message: "Itinerary not found",
      });
    }
    const deleted = await this.itineraryService.delete(itineraryId, userId);
    return res.send(
      new SuccessResponse({
        message: "Itinerary deleted",
        data: deleted,
        status: StatusCodes.OK,
      })
    );
  }
}
