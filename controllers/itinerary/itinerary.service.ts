import ItineraryModel from "./itinerary.model";
import { CreateItineraryDto, UpdateItineraryDto } from "./itinerary.dto";
import { differenceInDays } from "date-fns";
import ErrorResponse from "../../common/ErrorResponse";
import { StatusCodes } from "http-status-codes";
import { PaginatedResponse } from "../../common/pagination";
import { Types } from "mongoose";

class ItineraryService {
  async create(userId: string, dto: CreateItineraryDto) {
    return await ItineraryModel.create({ ...dto, user: userId });
  }
  async findById(userId: string, itineraryId: string) {
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
      $and: [{ startDate: { $gte: startDate } }, { startDate: { $lte: endDate } }],
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

    return { data, total, page, limit };
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

  async totalItineraries(userId: string) {
    return await ItineraryModel.countDocuments({ user: userId });
  }

  async getUpcomingTripsCount(userId: string) {
    const now = new Date();
    return await ItineraryModel.countDocuments({
      startDate: { $gt: now },
      user: userId,
    });
  }

  async getTotalBudgetPerMonth(userId: string) {
    const results = await ItineraryModel.aggregate([
      { $match: { user: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            year: { $year: "$startDate" },
            month: { $month: "$startDate" },
          },
          totalBudget: { $sum: "$budget" },
        },
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          totalBudget: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);
    return results;
  }
  async getTotalTripsByMonth(userId: string) {
    const results = await ItineraryModel.aggregate([
      { $match: { user: new Types.ObjectId(userId), deletedAt: null } },
      {
        $group: {
          _id: {
            year: { $year: "$startDate" },
            month: { $month: "$startDate" },
          },
          totalTrips: { $sum: 1 },
        },
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          totalTrips: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    return results;
  }
}

export default ItineraryService;
