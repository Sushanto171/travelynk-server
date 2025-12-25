import { JwtPayload } from "jsonwebtoken";
import { httpStatus } from "../../helpers/httpStatus";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const getStats = catchAsync(async (req, res) => {
  const stats = await StatsService.getStats(req.user as JwtPayload);
  sendResponse(res, {
    success: true,
    message: "User stats fetched successfully",
    data: stats,
    statusCode: httpStatus.OK
  })
})


export const StatsController = {
  getStats
}