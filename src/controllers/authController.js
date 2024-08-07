import { MyError } from "../error/MyError.js"
import { createToken } from "../libs/createToken.js"
import { Doctor } from "../models/Doctor.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
    try {
        //throw new Error('error unexpected')
        const {body} = req
        //console.log(body);
        const newDoctor = new Doctor(body)
        await newDoctor.save()
        res.status(201).send(newDoctor)
    }catch(error) {
        //res.status(500).send({message : error})
        next(error)
    }

}

 

export const login = async (req, res, next) => {
    try {
        //throw new Error()
        const {body} = req 
        const doc = new Doctor()
        const emailIsvalid = doc.validateEmail(body.email)
        const passworIsValid = doc.validatePassword(body.password)
        if(emailIsvalid) {
            return next(new MyError('inserta un email valido'))
        }
        if(passworIsValid) {
            return  next(new MyError('inserta un password valido'))
        }

        // si pasamos todos los filtros consultamos a la Db
        const doctorFound = await Doctor.findOne({email : body.email})
        
        if(!doctorFound) {
            return next(new MyError('no se encontro al doctor'))
        }
        // si existe el doctor comparamos el password de la db con lo que manda el usuario
        const result = await bcrypt.compare(body.password, doctorFound.password)
        //console.log(result);
        if(!result) {
            return next(new MyError('error al validar cuenta'))
        }
        // luego de validar los datos satisfactoriamente creamos el token
        const token = createToken(doctorFound._id)
        //console.log(token);
        console.log(req.cookies);// cookies o credenciales que manda el cliente
        // mediante express enviamos la cookie con el metodo propio de express
        // res.cookie()lo que hace es configurar el encabezado HTTP Set-Cookiecon las opciones proporcionadas. 
        res.cookie('tokenDoctor', token,  { 
            httpOnly : false, 
            secure : false,
            sameSite : 'strict', 
            path:'/',
            maxAge : 3000*60*60 
        } )
        // luego de crear el token enviamos el token al cliente
        const copy = {...doctorFound._doc}
        delete copy['password']
        res.send(copy)
    }catch(error) {
        next(new MyError(error.message || 'ocurrio un error inesperado al intentar iniciar sesion'))
        //res.status(500).send({message : error.message})
    }
} 


/* no podemos reutilizar el middleware de validate Auth por el echo de que es un middleware y si el usuario se logueo correctamente nunca lo retornaria,
si hago que el midleware de autenticacion retorne algo cuando el usuario se a logueado correctamente entonces este mataria el proceso y nunca entraria a los controladores o rutas que le siguen como el  doctorRoutes y patientRoutes  */

export const verifyToken = async (req, res, next) => {
    try {
        const {tokenDoctor} = req.cookies
        console.log(tokenDoctor);
        if(!tokenDoctor) {
            return res.status(404).send({message : 'usuario no autenticado'}) 
        }
        // aqui decodificamos el token, con la misma cadena que lo codificamos
        const {id} =  jwt.verify(tokenDoctor, 'secret')
        console.log(`este es el id del usuario autenticado del authcontroller ${id}`);
        const doctor = await Doctor.findById({_id : id})
        .select('-password')
        if(!doctor) {
           return next(new MyError('no se encontro al doctor'))
        }
        res.status(200).send(doctor) 
        
    }catch(error) {      
        next(new MyError(error.message || 'ocurrio un error inesperado al intentar obtener credenciales'))
    }
} 




export const logout = async (req, res, next) => {
    res.cookie("tokenDoctor", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
      });
    return res.sendStatus(200); 
}






