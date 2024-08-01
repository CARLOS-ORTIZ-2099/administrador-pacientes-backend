import express from 'express'
import {deleteDoctor, getDoctor, getDoctors, updateDoctor} from '../controllers/doctorController.js'
import { multerMid } from '../middlewares/multerMiddleware.js'
import { validateAuth } from '../middlewares/validateAuth.js'



export const doctorRoutes = express.Router()


doctorRoutes.get('/get-doctors',  getDoctors)
doctorRoutes.get('/get-doctor/:id', getDoctor)
doctorRoutes.delete('/delete-doctor/:id', deleteDoctor)
doctorRoutes.put('/update-doctor/:id', multerMid, updateDoctor)







