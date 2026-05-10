import { Router } from "express";
import { getApplicationUpdate, getCurrentUser, updateUser, getAllUsers, getAdminData } from "../control component/userControl.js";
import { validateUserUpdate } from "../ErrorHandlerMidleware/ValidatorMidleware.js";
import { authorizeUser } from "../ErrorHandlerMidleware/authMiddleware.js";
import multer from 'multer';

const route = Router()
const upload = multer({ storage: multer.memoryStorage() })

route.get('/current-user', getCurrentUser)  
route.get('/admin/all-users', authorizeUser, getAdminData)
route.patch('/update-profile', upload.single('avatar'), validateUserUpdate ,updateUser)

export default route