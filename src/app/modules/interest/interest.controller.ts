import { httpStatus } from "../../helpers/httpStatus"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { InterestService } from "./interest.service"

const getAllFormDB = catchAsync(async (req, res) => {
  const result = await InterestService.getAllFormDB()
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All interest retrieved successfully",
    data: result
  })
})

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await InterestService.insertIntoDB(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "interest inserted successfully",
    data: result
  })
})
const getById = catchAsync(async (req, res) => {
  const result = await InterestService.getById(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "interest data retrieved successfully",
    data: result
  })
})

const updateById = catchAsync(async (req, res) => {
  const result = await InterestService.updateById(req.params.id, req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "interest updated successfully",
    data: result
  })
})

const deleteById = catchAsync(async (req, res) => {
  await InterestService.deleteById(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "interest delete successfully",
    data: null
  })
})

export const InterestController = {
  getAllFormDB,
  getById,
  updateById,
  insertIntoDB,
  deleteById
}