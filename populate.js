import mongoose from "mongoose";
import userModel from "./Model/userModel.js";
import jobModel from "./Model/jobModel.js";
import { readFile } from "fs/promises";
import { hashedPasword } from "./utilities/comparePassword.js";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();


try {
    await mongoose.connect(process.env.MONGODB_URL)
    let user = await userModel.findOne({email: "demo@jobposter.com"})
    
    if (!user) {
        const hashedPassword = await hashedPasword("123456");
        user = await userModel.create({
            name: "Demo User",
            email: "demo@jobposter.com",
            password: hashedPassword,
            role: "user"
        });
        console.log("Demo user created");
    }
    
    const jsonjob = JSON.parse(await readFile(new URL("./utilities/mockdata.json", import.meta.url)))
    const job = jsonjob.map((item) => {
        return {...item, createdBy: user._id}
    })
    await jobModel.deleteMany({createdBy: user._id})
    await jobModel.create(job)
    console.log("job populated");
     console.log("user populated");
     process.exit(0)


} catch (error) {
    console.log(error);
}