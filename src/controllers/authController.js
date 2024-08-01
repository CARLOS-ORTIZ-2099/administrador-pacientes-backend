import { MyError } from "../error/MyError.js"
import { createToken } from "../libs/createToken.js"
import { Doctor } from "../models/Doctor.js"
import bcrypt from 'bcrypt'

export const register = async (req, res, next) => {
    try {
        //throw new Error('error bestial')
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
        const {body} = req 
       
        const doc = new Doctor()
        const emailIsvalid = doc.validateEmail(body.email)
        const passworIsValid = doc.validatePassword(body.password)
        if(emailIsvalid) {
            return next(new MyError('eso no parece un email'))
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
        console.log(req.cookies);
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
        res.send({doctorFound, token})
    }catch(error) {
        res.status(500).send({message : error.message})
    }
}
