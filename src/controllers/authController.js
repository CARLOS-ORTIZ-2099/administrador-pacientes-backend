import { Doctor } from "../models/Doctor.js"
import bcrypt from 'bcrypt'

export const register = async (req, res, next) => {
    try {
        const {body} = req
        //console.log(body);
        const newDoctor = new Doctor(body)
        await newDoctor.save()
        res.status(201).send(newDoctor)
    }catch(error) {
        res.status(500).send({message : error})
    }

}



export const login = async (req, res, next) => {
    try {
        const {body} = req 
       
        const doc = new Doctor()
        const emailIsvalid = doc.validateEmail(body.email)
        const passworIsValid = doc.validatePassword(body.password)
        if(emailIsvalid) {
           return res.send({message : 'email no es valido'})
        }
        if(passworIsValid) {
            return res.send({message : 'password no es valido'})
        }

        // si pasamos todos los filtros consultamos a la Db
        const doctorFound = await Doctor.findOne({email : body.email})
        
        if(!doctorFound) {
            return next(new Error('no existe el doctor'))
        }
        // si existe el doctor comparamos el password de la db con lo que manda el usuario
        const result = await bcrypt.compare(body.password, doctorFound.password)
        console.log(result);
        if(!result) {
            return res.send({message : 'error al validar cuenta'})
        }
        res.send({doctorFound})
    }catch(error) {
        res.status(500).send({message : error.message})
    }
}
