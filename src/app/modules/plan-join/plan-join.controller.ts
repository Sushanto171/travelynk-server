/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { httpStatus } from "../../helpers/httpStatus"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { PlanJoinService } from "./plan-join.service"


const requestToJoin = catchAsync(async (req, res) => {
  await PlanJoinService.requestToJoin(req.user!, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Join request successfully",
    data: null
  })
})

const getMyRequestedPlan = catchAsync(async (req, res) => {
  const result = await PlanJoinService.getMyRequestedPlan(req.user!)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All join request retrieved successfully",
    data: result
  })
})

const getMyRequestedPlanById = catchAsync(async (req, res) => {
  const result = await PlanJoinService.getMyRequestedPlanById(req.user!, req.params.plan_id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Requested plan retrieved successfully",
    data: result
  })
})

const removeRequestById = catchAsync(async (req, res) => {
  await PlanJoinService.removeRequestByID(req.user!, req.params.plan_id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Requested removed successfully",
    data: null
  })
})

const updateRequestedStatus = catchAsync(async (req, res) => {
  const result = await PlanJoinService.updateRequestedStatus(req.user!, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Requested removed successfully",
    data: result
  })
})

export const PlanJoinController = {
  requestToJoin,
  getMyRequestedPlan,
  getMyRequestedPlanById,
  removeRequestById,
  updateRequestedStatus
}