
import { UnauthenticationError, Unautherization } from "../error/customerrors.js"
import { varifyjwt } from "../utilities/jsonToken.js";

export const authenticatedUser = (req, res, next) => {
    const {token} = req.cookies;
    if(!token) throw new Unautherization('No token provided')
   

    try {
        
        //  const {userid, role} = varifyjwt(token) 
        //  req.user = { id: userid, role };
          const decoded = varifyjwt(token) 
          const testUser = decoded.userid === '69c2501308e322436bdf64a0'
        req.user = { userId: decoded.userid, role: decoded.role, testUser };
          next();
    } catch (error) {
        throw new UnauthenticationError('Not authorized to access this route')
    }
}

export const authorizeUser = (req, res, next) => {
    const {role} = req.user
    if(role !== 'admin') throw new Unautherization('Not authorized to access this route')
    next()
}

export const checkForTestUser = (req, res, next) => {
    if(req.user.testUser) throw new Unautherization('Test user not authorized to access this route')
        next()
}