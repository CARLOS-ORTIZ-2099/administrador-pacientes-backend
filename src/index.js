import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'


import {doctorRoutes} from './routes/doctorRoutes.js'
import {auhtRoutes} from './routes/authRoutes.js'
import { db } from './database/db.js'
import { patientRoutes } from './routes/patientRoutes.js'
import { validateAuth } from './middlewares/validateAuth.js'
import { MyError } from './error/MyError.js'

db().catch(error => console.log(error.message))

dotenv.config()
const app = express()
const port = process.env.PORT || 3000


// midllewares of  functions generals as read json and  forms fields 
app.use(express.json())
app.use(express.urlencoded({extended : true}))
// analizador de cookies que llegen como parte de los encabezados de la solicitus
app.use(cookieParser())

// middleware that handler petition routes
app.use('/api/auth', auhtRoutes)
app.use('/api/doctor', validateAuth, doctorRoutes)
app.use('/api/patient', validateAuth, patientRoutes)




// middleware that handler error when not found routes
app.use((req, res, next) => {
    res.status(404).send({msg : 'not found'})
})

// middleware that handler error of execution in any routes
app.use((err, req, res, next) => {
    // error de datos duplicados, cuando intentamos crear un doctor con credenciales que ya se registraron anteriormente, este erroe se basa en la propiedad unique que es propio de mongo db no de mongoose es por eso que se valida aqui
    if(err.code == '11000'){

        const typeError = Object.keys(err.keyValue)[0] ==  "email" ?
         "Otra cuenta usa el mismo correo electrónico." : "Este nombre de usuario no está disponible. Prueba con otro."
        return res.status(500).send({message : [typeError]})
 
     }
     // errores personalizados mios
     else if(err instanceof MyError) {
         return res.status(500).send({message : err.message})
     }
     
    // errores de validacion de mongoose 
    res.status(500).send({message : Object.values(err.errors).map(error => error.message) })
})


app.listen(port, () => console.log(`server listening on port ${port}`.magenta))





