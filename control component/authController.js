import { StatusCodes } from "http-status-codes"
import User from "../Model/userModel.js"

import { Unautherization } from "../error/customerrors.js";
import { comparePassword, hashedPasword } from "../utilities/comparePassword.js";
import { jwtToken } from "../utilities/jsonToken.js";
import { cookie } from "express-validator";
import { MongoExpiredSessionError } from "mongodb";

export const register = async (req, res) => {
    const firstUserInput = (await User.countDocuments()) === 0 
    console.log("firstUserInput:", firstUserInput)
     // Always set the role, ignore anything from req.body.role
    const role = firstUserInput ? 'admin' : 'user'
     const hashedPassword = await hashedPasword(req.body.password);

    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword, // use the hashed password here
        lastName: req.body.lastName, // optional
        location: req.body.location, // optional
        role // use the role variable you set above
    })
    console.log("user:", user)
    
    const token = jwtToken({userid: user._id, role: user.role})
    const oneDay = 1000 *60*60*24
    
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
    })
    res.status(StatusCodes.CREATED).json({message: 'User created and logged in'})
}
export const login = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    const validUser = user && await comparePassword(req.body.password, user.password);
        if(!validUser) throw new Unautherization('Invalid Credientiasssl')
            const token = jwtToken({userid: user._id, role: user.role})
        const oneDay = 1000 *60*60*24

        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + oneDay),
            secure: process.env.NODE_ENV === 'production',
        }
    )
    res.status(StatusCodes.OK).json({message: 'User Logged In'})
}

export const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === 'production',
    })
    res.status(StatusCodes.OK).json({message: 'User Logged Out'})
}