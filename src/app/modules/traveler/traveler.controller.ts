import { httpStatus } from "../../helpers/httpStatus"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { TravelerService } from "./traveler.service"

const getAllFormDB = catchAsync(async (req, res) => {
  const result = await TravelerService.getAllFormDB()
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All travelers retrieved successfully",
    data: result
  })
})

const getById = catchAsync(async (req, res) => {
  const result = await TravelerService.getById(req.params.id)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Traveler full details retrieved successfully.",
    data: result
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

  const result = await TravelerService.softDelete(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Soft deleted successfully.",
    data: result
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

export const TravelerController = {
  getAllFormDB,
  getById,
  updateById,
  softDelete,
  deleteById
}