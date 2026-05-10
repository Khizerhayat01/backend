import { StatusCodes } from "http-status-codes"

const errorHandlerMidleware = (err, req, res, next) => {
    console.log(err)
    const statuscode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    const msg = err.message || "internal server error"
    res.status(statuscode).json({message: msg})
}

export default errorHandlerMidleware