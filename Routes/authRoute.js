import { Router } from "express";
import { login, logout, register } from "../control component/authController.js";
import { validatedLoginInput, validatedRegisterInput } from "../ErrorHandlerMidleware/ValidatorMidleware.js";

// Use Router() directly
const route = Router();
route.post('/register', validatedRegisterInput, register);
route.post('/login', validatedLoginInput, login);
route.get('/logout', logout);

export default route;
// ... existing code ...