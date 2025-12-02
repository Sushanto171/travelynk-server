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
    statusCode: httpStatus.OK,
    message: "Plan created successfully",
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

export const PlanController = {
  getAllFormDB,
  insertIntoDB,
  getById,
  updateById,
  softDelete,
  deleteById
}