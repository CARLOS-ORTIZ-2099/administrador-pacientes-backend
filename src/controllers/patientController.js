import { Doctor } from "../models/Doctor.js";
import bcrypt from 'bcrypt'

import { Patient } from "../models/Patient.js";
import { MyError } from "../error/MyError.js";

export const getPatients = async (req, res, next) => {
    try {
        const patients = await Patient.find()
        console.log(patients);
        res.send(patients)
    }catch(error) {
        console.log(error);
        next(new MyError(error.message || 'ocurrio un error inesperado, recarga nuevamente o intenta mas tarde'))
        //res.status(500).send({message : error.message})
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
            res.send({message : 'no existe el doctor'})
        }
        res.send(patient)
    }catch(error) {
        /* console.log(error); */
        next(new MyError(error.message || 'ocurrio un error inesperado, al obtener paciente'))
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
            //res.send({message : 'no existe el doctor'})
        }
        res.send(patient)
    }catch(error) {
        /* console.log(error); */
        next(new MyError(error.message || 'ocurrio un error inesperado, al eliminar paciente'))
        //res.status(500).send({message : error})
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
                //res.send({message : 'email invalido'})
            }
            const patFound = await Patient.find({email : body.email})
            //console.log(doctFound);
            if(patFound.length > 0) {
                return next(new MyError('este correo ya esta en uso'))
                //res.send({message : 'este correo ya esta en uso'})
            }
        }


        const patient = await Patient.findByIdAndUpdate({ _id: id }, body)
        //console.log(doctor);
        if(!patient) {
            return next(new MyError('no existe el paciente'))
            //res.send({message : 'no existe el paciente'})
        }
        res.send(patient)
    }catch(error) {
        /* console.log(error); */
        next(new MyError(error.message ||  'ocurrio un error inesperado, al actualizar paciente'))
        //res.status(404).send({message : error.message})
    }
}

export const createPatient = async (req, res, next) => {
    try {
        const {body} = req
        //console.log(body);

        // antes de crear debemos sersionarnos si ya hay un paciente registrado en el sistema, ya sea conmino o con otro doctor
        const newPatient = new Patient(body)
        await newPatient.save()
        res.status(201).send(newPatient)
    }catch(error) {
        //next(error)
        res.status(500).send({message : error})
    }
}


