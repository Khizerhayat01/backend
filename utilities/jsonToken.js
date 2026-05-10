import jwt from 'jsonwebtoken';


export const jwtToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    return token;
}

export const varifyjwt = (token) => {
    const decoded = jwt.verify(
        token, process.env.JWT_SECRET)
        console.log('Decoded JWT:', decoded);
    return decoded;
}