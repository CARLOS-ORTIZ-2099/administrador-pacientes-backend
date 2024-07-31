import express from 'express'
import {login, register} from '../controllers/authController.js'


export const auhtRoutes = express.Router()


auhtRoutes.post('/', register)
auhtRoutes.post('/login', login)