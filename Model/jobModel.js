import mongoose from "mongoose";
import { JOBSTATUS, JOBTYPE } from "../utilities/utilit.js";


const jobSchema = new mongoose.Schema({
    company: String,
    position: String,
    jobStatus: {
        type: String,
        enum: Object.values(JOBSTATUS),
        default: JOBSTATUS.PENDING
    },
    jobType: {
        type: String,
        enum: Object.values(JOBTYPE),
        default: JOBTYPE.FULLTIME
    },
    jobLocation: {
        type: String,
        default: 'remote'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
},
 {timestamps: true}
)

export default mongoose.model("Job", jobSchema)