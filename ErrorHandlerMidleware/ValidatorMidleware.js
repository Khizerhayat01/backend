import { body, param, validationResult } from "express-validator"
import { BadRequestError, CustomError, UnauthenticationError, Unautherization } from "../error/customerrors.js"
import { JOBSTATUS, JOBTYPE } from "../utilities/utilit.js"
import mongoose from "mongoose"
import Job from "../Model/jobModel.js"
import User from "../Model/userModel.js"


const withValidatorError = (validatorValue) => {
    return [
        validatorValue,
        (req, res, next) => {
            const error = validationResult(req)
            if(!error.isEmpty()) {
                const errorsMessage = error.array().map((item) => item.msg).join(", ")
                if(errorsMessage[0].startsWith('no jobs'))
                        return next(new CustomError(errorsMessage))
                if(errorsMessage[0].startsWith('no authorized'))
                    return next(new UnauthenticationError(errorsMessage))    
                throw new BadRequestError(errorsMessage)
            }
            next()
        }
    ]
}

export const validatorTest = withValidatorError(
    [
    body('company').notEmpty().withMessage('company is require'),
    body('position').notEmpty().withMessage('Position is require'),
    body('jobLocation').notEmpty().withMessage('joblocation is require'),
    body('jobStatus').isIn(Object.values(JOBSTATUS)).withMessage('Invalid sattus Value'),
    body('jobType').isIn(Object.values(JOBTYPE)).withMessage('Invalid jobType Value')
    ]
)

export const validatedRegisterInput = withValidatorError(
    [
        body('name').notEmpty().withMessage('name is require'),
        body('email').isEmail().withMessage('Invalid email')
        .notEmpty()
        .withMessage('email is require')
        .custom(async (value) => {
            const user = await User.findOne({email: value})
            if(user) throw new Error('email already exist')
        })
        ,
        body('password').notEmpty().withMessage('password is require').notEmpty().withMessage('password is require')
        .isLength({min: 6})
        .withMessage('password must be at least 6 characters long')
        ,
        body('lastName').notEmpty().withMessage('lastName is require'),
        body('location').notEmpty().withMessage('location is require')
    ]
)
export const validatedLoginInput = withValidatorError(
    [
        body('email').isEmail().withMessage('Invalid email')
        .notEmpty()
        .withMessage('email is require'),
        body('password').notEmpty().withMessage('password is require').notEmpty().withMessage('password is require')
        .isLength({min: 6})
        .withMessage('password must be at least 6 characters long')
        
    ]
)

export const validateIdParams = withValidatorError(
    [
        param('id').custom(async (value, {req}) =>  {
            
            const isValidId = mongoose.Types.ObjectId.isValid(value)
            if(!isValidId) throw new Error('Invalid id params')
            
            const job = await Job.findById(value)
            if (!job) throw new Error(`no jobs found with id ${value}`)

            const isAdmin = req.user.role === 'admin';
            const isOwner = req.user.userId.toString() === job.createdBy.toString();
            
            if(!isAdmin && !isOwner) {
                throw new Error('You are not authorized to perform this action')
            }
        }
).withMessage('Invalid id params')
    ]
)

export const validateUserUpdate = withValidatorError(
    [
        body('name').notEmpty().withMessage('name is require'),
        body('email').isEmail().withMessage('Invalid email')
        .notEmpty()
        .withMessage('email is require')
        .custom(async (email, {req}) => {
            const user = await User.findOne({email})
            if(user && user._id.toString() !== req.user.userId) throw new Error('email already exist')
        }),
        body('lastName').notEmpty().withMessage('lastName is require'),
        body('location').notEmpty().withMessage('location is require')
    ]
)