

import { Patient } from "../models/Patient.js"; 
import { MyError } from "../error/MyError.js";
import colors from 'colors'

export const getPatients = async (req, res, next) => {
    try { 
        const {iddoctor} = req.query
        //console.log(`${iddoctor}`.red);
        //console.log(`${req.url}`.cyan);
        
        const {id} = req.user
        const patients = await Patient.find({doc : iddoctor || id})
        //console.log(patients);
        res.send(patients)
    }catch(error) {
        console.log(error);
        next(new MyError(error.message || 'ocurrio un error inesperado, recarga nuevamente o intenta mas tarde'))
        //res.status(500).send({message : error.message})
    }
}

export const deletePatient = async (req, res, next) => {
    try {
        const {id} = req.params 
        const patient = await Patient.findOneAndDelete({ _id: id })
        console.log(patient);
        if(!patient) {
            return next(new MyError('no existe el paciente'))
        }
        res.send(patient)
    }catch(error) {
        /* console.log(error); */
        next(new MyError(error.message || 'ocurrio un error inesperado, al eliminar paciente'))
    }
}



export const getPatient = async (req, res, next) => {
    try {
        //throw new Error()
        const {id} = req.params
        const patient = await Patient.findById({_id : id})
        console.log(patient);
        if(!patient) {
            return  next(new MyError('no existe el doctor'))
        }
        res.send(patient)
    }catch(error) {
        /* console.log(error); */
        next(new MyError(error.message || 'ocurrio un error inesperado, al obtener paciente'))
    }
}




export const updatePatient = async (req, res, next) => {
    try {
        // en este punto gracias al middleware de multer tendremos un
        // objeto file o files creado en nuestro objeto global request
        const {id} = req.params
        const {body} = req
        /* tenemos que tener en cuenta lo siguiente una persona no puede
           cambiarse de nombre, apellido y cedula una vez registrado, lo
           que si puede cambiarse es su email, password y avatar   
        */
        /* antes de hacer la actualizacion primero corroborar que no haya
           otro doctor con el mismo correo al que se quiere cambiar 
           y que este correo sea valido
        */
        console.log(body);
        const pat = new Patient() 
        if(body.email) {
            console.log('entro');
            const validateEmail = pat.validateEmail(body.email)
            // si pasamos la validacion del email buscamos en la db si hay algu doctor con ese mismo correo
            if(validateEmail) {
                return next(new MyError('email invalido'))
            }
            // aqui debo validar si hay un paciente que no sea el que estoy
            // intentando editar que tenga un correo identico al que se recibe en el cuerpo de la solicitud, si se cumple quiere decir que ya un paciente que usa ese correo electronico, si ese paciente cuyo correo es igual soy yo entonces no hay problema
            const patFound = await Patient.find({email : body.email, _id : {$ne :id}})
            console.log(patFound);
            if(patFound.length > 0) {
                return next(new MyError('este correo ya esta en uso'))
            }
        }
       
        const patient = await Patient.findByIdAndUpdate({ _id: id }, body, {new : true})
        //console.log(patient);
        if(!patient) {
            return next(new MyError('no existe el paciente'))
        }
        res.send(patient)
    }catch(error) {
        /* console.log(error); */
        next(new MyError(error.message ||  'ocurrio un error inesperado, al actualizar paciente'))
    }
}

export const createPatient = async (req, res, next) => {
    try {
        const {body} = req
        //console.log(body);
        const {id} = req.user
        // antes de crear debemos sersionarnos si ya hay un paciente registrado en el sistema, ya sea conmino o con otro doctor
        const newPatient = new Patient({...body, doc : id})
        await newPatient.save()
        res.status(201).send(newPatient)
    }catch(error) {
        next(error)
        //res.status(500).send({message : error})
    }
}


