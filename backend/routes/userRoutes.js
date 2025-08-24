import express from 'express'
import {registerUser,logLout,loginUser,getUserProfile,updateUserProfile} from '../controllers/userControllers.js'
import {protect} from "../middlewares/authMiddleware.js";
const router=express.Router()

router.route('/signup').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logLout)

// Profile routes
router.route('/profile').get(protect, getUserProfile)
router.route('/profile').put(protect, updateUserProfile)


export default router