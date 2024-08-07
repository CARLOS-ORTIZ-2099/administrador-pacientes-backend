import express from 'express'
import {login, logout, register, verifyToken} from '../controllers/authController.js'


export const auhtRoutes = express.Router()


auhtRoutes.post('/', register)
auhtRoutes.post('/login', login)
auhtRoutes.get('/verifyToken', verifyToken)
auhtRoutes.get('/logout', logout)