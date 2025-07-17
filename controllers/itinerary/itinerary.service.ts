import ItineraryModel from "./itinerary.model";
import { CreateItineraryDto, UpdateItineraryDto } from "./itinerary.dto";
import { differenceInDays } from "date-fns";
import ErrorResponse from "../../common/ErrorResponse";
import { StatusCodes } from "http-status-codes";
import { PaginatedResponse } from "../../common/pagination";

class ItineraryService {
  async create(userId: string, dto: CreateItineraryDto) {
    return await ItineraryModel.create({ ...dto, user: userId });
  }
  async findById(userId: string, itineraryId: string) {
    console.debug(
      "🚀 ~ ItineraryService ~ findById ~ itineraryId:",
      itineraryId
    );
    console.debug("🚀 ~ ItineraryService ~ findById ~ userId:", userId);
    return await ItineraryModel.findOne({ _id: itineraryId, user: userId });
  }

  async listUserCalendar(userId: string, startDate: string, endDate: string) {
    const differenceBetweenDays = differenceInDays(
      new Date(endDate),
      new Date(startDate)
    );
    if (differenceBetweenDays > 31) {
      throw new ErrorResponse({
        message: "Start date and end date must not differ by more than 31 days",
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const query: any = {
      user: userId,
      $or: [{ startDate: { $gte: startDate } }, { endDate: { $lte: endDate } }],
    };

    const results = await ItineraryModel.find(query).sort({ startDate: 1 });

    return results;
  }

  async listUserItinerary(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ItineraryModel.find({ user: userId })
        .skip(skip)
        .limit(limit)
        .sort({ startDate: 1 }),
      ItineraryModel.countDocuments({ user: userId }),
    ]);

    return new PaginatedResponse(data, total, page, limit);
  }
  async update(id: string, userId: string, dto: UpdateItineraryDto) {
    const itinerary = await ItineraryModel.findOneAndUpdate(
      { _id: id, user: userId },
      dto,
      { new: true }
    );
    return itinerary;
  }

  async delete(id: string, userId: string) {
    return await ItineraryModel.findOneAndUpdate(
      { _id: id, user: userId },
      { deletedAt: new Date() }
    );
  }

  async isValidItinerary(
    userId: string,
    startDate: string,
    endDate: string,
    excludeId?: string
  ) {
    const query: any = {
      user: userId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    };

    if (excludeId) {
      query._id = { $ne: excludeId }; // exclude current itinerary in update
    }

    const existing = await ItineraryModel.find(query);
    return existing.length;
  }
}

export default ItineraryService;
