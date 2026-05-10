import { StatusCodes } from 'http-status-codes'
import Job from '../Model/jobModel.js'
import jobModel from '../Model/jobModel.js'
import mongoose from 'mongoose'


let jobs = [
    {
        id: 1, company: "Google", position: "Frontend Developer"
    },
    {
        id: 2, company: "Microsoft", position: "Backend Developer"
    }
]


//Get all Job
export const GetAllJobs = async (req, res) => {
    const { search, jobStatus, jobType, sort, page = 1, limit = 10 } = req.query

    const queryObject = {
        createdBy: req.user.userId
    }

    if (search) {
        const regex = new RegExp(search, 'i')
        queryObject.$or = [
            { position: regex },
            { company: regex }
        ]
    }

    if (jobStatus && jobStatus !== 'all') {
        queryObject.jobStatus = jobStatus
    }

    if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType
    }

    const sortOption = {
        newest: 'createdAt',
        oldest: '-createdAt',
        'a-z': 'position',
       ' z-a': '-position'
    }

    const sortFeild = sortOption[sort] || sortOption.newest
    
    // Pagination setup
    const pageNum = Number(page)
    const pageLimit = Number(limit)
    const skip = (pageNum - 1) * pageLimit
    
    let result = Job.find(queryObject).sort(sortFeild).skip(skip).limit(pageLimit)

    // if (sort === 'oldest') {
    //     result = result.sort({ createdAt: 1 })
    // } else {
    //     result = result.sort({ createdAt: -1 })
    // }

    const jobs = await result
    const totalJobs = await Job.countDocuments(queryObject)
    const totalPages = Math.ceil(totalJobs / pageLimit)
    
    res.status(StatusCodes.OK).json({ jobs, totalJobs, totalPages, currentPage: pageNum })
}

//Get single Job

export const SingleJob = async (req, res) => {

   const job = await Job.findById(req.params.id)
   
  
    res.status(200).json(job)
}

//Create job
export const CreateJob = async (req, res) => {
    req.body.createdBy = req.user.userId
  try {
     const job = await Job.create(req.body)
    res.status(201).json({job})
  } catch (error) {
    res.status(StatusCodes.CREATED).json({message: 'internal server error'})
  }
}



export const EditJob =  async (req, res) => {

     try {
        const { id } = req.params
        
        const updatedJob = await Job.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true } // Added runValidators
        )
        
      
        
        res.status(StatusCodes.OK).json({ msg: 'Job updated', job: updatedJob })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }

    // const {id} = req.params; 
    // const {company, position} = req.body
    // const updatedJob = await  Job.findByIdAndUpdate(id, req.body, {new: true})
    // if(!updatedJob) {
    //     return res.status(404).json({message: `no job with id ${id}`})
    // }

    // updatedJob.company = company
    // updatedJob.position = position
    // res.status(200).json({msg: 'job Updated', updatedJob})
}


export const DeleteJob = async (req, res) => {

     try {
 const deletedJob = await Job.findByIdAndDelete(req.params.id)
        
        res.status(200).json({ msg: 'Job deleted', job: deletedJob })
    } catch (error) {
        res.status(StatusCodes.OK).json({ message: 'Internal server error' })
    }
    // const {id} = req.params; 
    // const job = jobs.find((job) => job.id === Number(id))
    
    // const DeleteJob =  await job.findByIdAndDelete(id);

    // if(!DeleteJob) {
    //     return res.status(404).json({message: `no job with id ${id}`})
    // }
    // console.log(DeleteJob)

    // res.status(200).json({msg: 'job Deleted', DeleteJob})
}

export const showState = async (req, res) => {
    const createdBy = new mongoose.Types.ObjectId(req.user.userId)

    let state = await Job.aggregate([
       { $match: { createdBy } },
       { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
    ])

    state = state.reduce((acc, cur) => {
        acc[cur._id] = cur.count
        return acc
    }, {})
    
    const defaultState = {
        pending: 0,
        interview: 0,
        declined: 0,
        DocumentTimeline: 0,
        ...state,
    }

    let monthlyApplication = await Job.aggregate([
        { $match: { createdBy } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
    ])

    monthlyApplication = monthlyApplication
        .map((item) => {
            const date = new Date(item._id.year, item._id.month - 1, 1)

            return {
                date: date.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
                count: item.count,
            }
        })
        .reverse()

    res.status(StatusCodes.OK).json({ defaultState, monthlyApplication })
}


