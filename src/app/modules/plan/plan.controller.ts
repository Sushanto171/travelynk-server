/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { queryOptions } from "../../constant/queryOptions"
import { httpStatus } from "../../helpers/httpStatus"
import { pick } from "../../helpers/pick"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { PlanService } from "./plan.service"

const getAllFormDB = catchAsync(async (req, res) => {

  const filters = pick(req.query, ["startDate", "endDate", "owner_id", "status", "tour_type", "searchTerm"]);
  const options = pick(req.query, queryOptions);

  const { data, meta } = await PlanService.getAllFormDB(filters, options)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All plan retrieved successfully",
    data,
    meta
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

const getBySlug = catchAsync(async (req, res) => {
  const result = await PlanService.getBySlug(req.params.slug)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plan retrieved successfully",
    data: result
  })
})

const getMyPlans = catchAsync(async (req, res) => {
  const result = await PlanService.getMyPlans(req.user!,)
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

export const PlanController = {
  getAllFormDB,
  insertIntoDB,
  getMyPlans,
  getBySlug,
  updateById,
  updateStatus,
  deleteById,
}