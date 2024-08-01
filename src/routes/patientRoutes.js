import express from 'express'
import {createPatient, deletePatient, getPatient, getPatients, updatePatient } from '../controllers/patientController.js'


export const patientRoutes = express.Router()


patientRoutes.get('/get-patients', getPatients)
patientRoutes.get('/get-patient/:id', getPatient)
patientRoutes.delete('/delete-patient/:id', deletePatient)
patientRoutes.post('/create-patient', createPatient)
patientRoutes.put('/update-patient/:id', updatePatient)