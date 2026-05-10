import { StatusCodes } from "http-status-codes";
import User from "../Model/userModel.js";
import Job from "../Model/jobModel.js"
import { v2 as cloudinary } from 'cloudinary';


export const getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user.userId) // Exclude the password field
    res.status(StatusCodes.OK).json({user})
}

export const getApplicationUpdate = async (req, res) => {
    const user = await User.countDocuments()
    const job = await Job.countDocuments()
    res.status(StatusCodes.OK).json({message: "Application Updated", user, job})
}

export const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password')
    res.status(StatusCodes.OK).json({users})
}

export const getAdminData = async (req, res) => {
    const users = await User.find({}).select('-password')
    const userCount = await User.countDocuments()
    const jobCount = await Job.countDocuments()
    res.status(StatusCodes.OK).json({users, userCount, jobCount})
}

export const updateUser = async (req, res) => {

     const data = { ...req.body };
  delete data.password;

  try {
    const user = await User.findById(req.user.userId);

    if (req.file) {
      // ✅ Use upload_stream — because multer is using memoryStorage (buffer, not path)
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer); // ✅ correct — buffer from memoryStorage
      });

      data.avatar = uploadResult.secure_url;
      data.avatarId = uploadResult.public_id;
    }

    // ✅ Update user first
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      data,
      { new: true, runValidators: true }
    ).select('-password'); // ✅ strip password from response

    // ✅ Only delete old avatar AFTER the DB update succeeds
    if (req.file && user.avatarId) {
      await cloudinary.uploader.destroy(user.avatarId);
    }

    res.status(StatusCodes.OK).json({ message: "User Updated", user: updatedUser });

  } catch (error) {
    console.error('Update failed:', error.message);
    console.error('Full error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Failed to update user',
      error: error.message 
    });
  }

    // const data = { ...req.body }
    // delete data.password
    
    //  const data = { ...req.body };
    // delete data.password;

    // try {
    //     // Find the user first to get the old avatarId
    //     const user = await User.findById(req.user.userId);

    //     if (req.file) {
    //         console.log('Uploading to Cloudinary:', req.file.originalname, req.file.size);
    //         const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
    //         console.log('Upload successful:', result.secure_url);
    //         data.avatar = result.secure_url;
    //         data.avatarId = result.public_id;

    //         // If there was an old avatar, delete it
    //         if (user.avatarId) {
    //             await cloudinary.uploader.destroy(user.avatarId);
    //         }
    //     }

    //     const updatedUser = await User.findByIdAndUpdate(req.user.userId, data, { new: true, runValidators: true });
    //     res.status(StatusCodes.OK).json({ message: "User Updated", user: updatedUser });

    // } catch (error) {
    //     console.error('Update failed:', error);
    //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update user' });
    // }
    // if (req.file) {
    //     try {
    //         console.log('Uploading to Cloudinary:', req.file.originalname, req.file.size)
    //         const result = await cloudinary.uploader.upload(req.file.buffer, { resource_type: 'image' })
    //         console.log('Upload successful:', result.secure_url)
    //         data.avatar = result.secure_url
    //         data.avatarId = result.public_id
    //         // No need to unlink since using memory storage
    //     } catch (error) {
    //         console.error('Cloudinary upload failed:', error.message)
    //         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to upload avatar' })
    //     }
    // }

    // try {
    //     const user = await User.findByIdAndUpdate(req.user.userId, data, { new: true, runValidators: true })

    //     // Destroy old avatar if a new one was uploaded and old exists
    //     if (req.file && user.avatarId) {
    //         try {
    //             await cloudinary.uploader.destroy(user.avatarId)
    //         } catch (destroyError) {
    //             console.error('Failed to destroy old avatar:', destroyError)
    //             // Don't fail the request for this
    //         }
    //     }

    //     res.status(StatusCodes.OK).json({ message: "User Updated", user })
    // } catch (updateError) {
    //     console.error('User update failed:', updateError)
    //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update user' })
    // }
}