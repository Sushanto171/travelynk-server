import { httpStatus } from "../../helpers/httpStatus"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"

const getAllFormDB = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "message",
    data: ""
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
  getAllFormDB,
  getById,
  updateById,
  softDelete,
  deleteById
}