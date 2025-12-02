/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { httpStatus } from "../../helpers/httpStatus"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { ReviewService } from "./review.service"

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await ReviewService.insertIntoDB(req.user!, req.params.plan_id, req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review created successfully",
    data: result
  })
})


const updateById = catchAsync(async (req, res) => {
  const result = await ReviewService.updateById(req.user!, req.params.id, req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully",
    data: result
  })
})


const deleteById = catchAsync(async (req, res) => {
  await ReviewService.deleteById(req.user!, req.params.id)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: null
  })
})

export const ReviewController = {
  insertIntoDB,
  updateById,
  deleteById
}