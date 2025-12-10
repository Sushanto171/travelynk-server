import { httpStatus } from "../../helpers/httpStatus"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { CountryService } from "./country.service"

const getAllFormDB = catchAsync(async (req, res) => {
  const result = await CountryService.getAllFormDB()
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All country retrieved successfully",
    data: result
  })
})

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await CountryService.insertIntoDB(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Country inserted successfully",
    data: result
  })
})
const getById = catchAsync(async (req, res) => {
  const result = await CountryService.getById(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Country data retrieved successfully",
    data: result
  })
})

const updateById = catchAsync(async (req, res) => {
  const result = await CountryService.updateById(req.params.id, req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Country updated successfully",
    data: result
  })
})

const deleteById = catchAsync(async (req, res) => {
  await CountryService.deleteById(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Country deleted successfully",
    data: null
  })
})

export const CountryController = {
  getAllFormDB,
  getById,
  updateById,
  insertIntoDB,
  deleteById
}