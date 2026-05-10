import { StatusCodes } from "http-status-codes"

 

 export class CustomError extends Error {
    constructor(message) {
        super(message)
        this.name = "CustomError"
        this.statusCode = StatusCodes.NOT_FOUND
    }
 }
 export class BadRequestError extends Error {
    constructor(message) {
        super(message)
        this.name = "BadRequestError"
        this.statusCode = StatusCodes.BAD_REQUEST
    }
 }
 export class Unautherization extends Error {
    constructor(message) {
        super(message)
        this.name = "Unautherization"
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
 }
 export class UnauthenticationError extends Error {
    constructor(message) {
        super(message)
        this.name = "UnauthenticationError"
        this.statusCode = StatusCodes.FORBIDDEN
    }
 }