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
    message: "message",
    data: result
  })
})

const getById = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "message",
    data: ""
  })
})

const updateById = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "message",
    data: ""
  })
})

const softDelete = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "message",
    data: ""
  })
})

const deleteById = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "message",
    data: ""
  })
})

export const ReviewController = {
  insertIntoDB,
  getById,
  updateById,
  softDelete,
  deleteById
}