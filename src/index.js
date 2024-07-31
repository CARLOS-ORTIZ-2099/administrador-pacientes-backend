import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import colors from 'colors'

import {doctorRoutes} from './routes/doctorRoutes.js'
import {auhtRoutes} from './routes/authRoutes.js'
import { db } from './database/db.js'


db().catch(error => console.log(error.message))

dotenv.config()
const app = express()
const port = process.env.PORT || 3000


// midllewares of  functions generals as read json and  forms fields 
app.use(express.json())
app.use(express.urlencoded({extended : true}))


// middleware that handler petition routes
app.use('/api/auth', auhtRoutes)
app.use('/api/doctor', doctorRoutes)




// middleware that handler error when not found routes
app.use((req, res, next) => {
    res.status(404).send({msg : 'not found'})
})

// middleware that handler error of execution in any routes
app.use((err, req, res, next) => {
    res.status(500).send({msg : err.message})
})


app.listen(port, () => console.log(`server listening on port ${port}`.magenta))





