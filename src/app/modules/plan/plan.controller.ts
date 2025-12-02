/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { httpStatus } from "../../helpers/httpStatus"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { PlanService } from "./plan.service"

const getAllFormDB = catchAsync(async (req, res) => {
  const result = await PlanService.getAllFormDB()
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All plan retrieved successfully",
    data: result
  })
})

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await PlanService.insertIntoDB(req.user!, req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Plan created successfully",
    data: result
  })
})

const getById = catchAsync(async (req, res) => {
  const result = await PlanService.getById(req.params.id)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plan retrieved successfully",
    data: result
  })
})

const updateById = catchAsync(async (req, res) => {
  const result = await PlanService.updateById(req.user!, req.params.id, req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plan updated successfully",
    data: result
  })
})

const updateStatus = catchAsync(async (req, res) => {
  const result = await PlanService.updatePlanStatus(req.user!, req.params.id, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plan status updated successfully",
    data: result
  })
})

const deleteById = catchAsync(async (req, res) => {
  await PlanService.deleteById(req.user!, req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plan deleted successfully",
    data: null
  })
})




// Plan (JOIN/BUDDIES) management here
const requestToJoin = catchAsync(async (req, res) => {
  await PlanService.requestToJoin(req.user!, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plan deleted successfully",
    data: null
  })
})

export const PlanController = {
  getAllFormDB,
  insertIntoDB,
  getById,
  updateById,
  updateStatus,
  deleteById,
  requestToJoin
}