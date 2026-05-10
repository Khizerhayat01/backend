

import express, { Router } from 'express'

const route = Router()

import {
    GetAllJobs,
    CreateJob,
    SingleJob,
    EditJob,
    DeleteJob,
    showState
} from '../control component/Control_component.js'
import { validateIdParams, validatorTest } from '../ErrorHandlerMidleware/ValidatorMidleware.js'
import { authenticatedUser, checkForTestUser } from '../ErrorHandlerMidleware/authMiddleware.js'

route.route('/').get(GetAllJobs).post(checkForTestUser, CreateJob, validateIdParams)
route.route('/:id').get(validateIdParams, SingleJob).patch(checkForTestUser,EditJob,validateIdParams).delete( checkForTestUser,DeleteJob,validateIdParams)

export default route

