import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import {doctorRoutes} from './routes/doctorRoutes.js'
import {auhtRoutes} from './routes/authRoutes.js'
import { db } from './database/db.js'
import { patientRoutes } from './routes/patientRoutes.js'
import { validateAuth } from './middlewares/validateAuth.js'
import { MyError } from './error/MyError.js'
import { findRoutes } from './libs/findRoutes.js'

db().catch(error => console.log(error.message))

dotenv.config()
const app = express()
const port = process.env.PORT || 3000


// cors configuracion
// esta configuracion sirve para decirle a express que cualquier persona
// conectada desde este dominio pueda consumir los recursos de la api
// asi mismo la propiedad credentials:true dice que las solicitudes HTTP realizadas incluirán las cookies y las credenciales, estas credenciales  
// pueden contener datos que sirvan para la autenticacion del usuario como
// las cookies por ejemplo.
app.use(cors({origin : 'http://localhost:5173', credentials:true}))
// midllewares of  functions generals as read json and  forms fields 
app.use(express.json())
app.use(express.urlencoded({extended : true}))
// analizador de cookies que llegen como parte de los encabezados de la solicitus
app.use(cookieParser())
// sirviendo archivos estaticos
app.use('/image',express.static(findRoutes('uploads')))


// middleware that handler petition routes 
app.use('/api/auth', auhtRoutes) 
app.use('/api/doctor', validateAuth, doctorRoutes)
app.use('/api/patient', validateAuth, patientRoutes) 


/* console.log(findRoutes('uploads')); */


// middleware that handler error when not found routes
app.use((req, res, next) => {
    res.status(404).send({msg : 'not found'})
})

// middleware that handler error of execution in any routes
// los errores que puedan surgir en los formularios los agrupo y envio en un arreglo
// esto por el echo de que pueden haber muchos campos que validar
// los errores personalizados mios, los envio en objeto de una sola propiedad
// por que por cada ruta donde pueda surgir un error solo enviare un mensaje en especifico
app.use((err, req, res, next) => {
    // error de datos duplicados, cuando intentamos crear un doctor con credenciales que ya se registraron anteriormente, este error se basa en la propiedad unique que es propio de mongo db no de mongoose es por eso que se valida aqui
    if(err.code == '11000'){
        res.status(500).send({message : 'las credenciales de cedula y correo deben ser unicas'})
 
     }
     // errores personalizados mios
     else if(err instanceof MyError) {
        res.status(500).send({message : err.message})
     }
     // errores de validacion de mongoose 
     else if(err.errors) {
        const data = {}
        for(let key in err.errors) {
            console.log(key);
            data[key] = err.errors[key].message
        }
        console.log(data);
        res.status(500).send(data)
     }
      // errores de validacion de mongoose   
     else{
         res.send({message : [err.message]})  
     }
    
})


app.listen(port, () => console.log(`server listening on port ${port}`.magenta))





