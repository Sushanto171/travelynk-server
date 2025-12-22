import { queryOptions } from "../../constant/queryOptions";
import { httpStatus } from "../../helpers/httpStatus";
import { pick } from "../../helpers/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NewsLatterService } from './newslatter.service';

const insertIntoDB = catchAsync(async (req, res) => {


  const data = await NewsLatterService.insertIntoDB(req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscribed successfully",
    data,
  })
})

const getAllFromDB = catchAsync(async (req, res) => {

  const filters = pick(req.query, ["searchTerm"]);
  const options = pick(req.query, queryOptions);

  const { data, meta } = await NewsLatterService.getAllFromDB(filters, options)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Newslatter emails retrieved successfully",
    data,
    meta
  })
})



export const NewsLatterController = {
  insertIntoDB,
  getAllFromDB
}