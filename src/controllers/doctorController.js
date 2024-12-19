import { Doctor } from "../models/Doctor.js";
import bcrypt from 'bcrypt'
import fs from 'fs/promises'
import { findRoutes } from "../libs/findRoutes.js";
import { MyError } from "../error/MyError.js";
import colors from 'colors'



export const getDoctors = async (req, res, next) => {
    try {
        //throw new Error()
        // obtener todos los doctores exepto el doctor autenticado actualmente , es decir solo ver a sus colegas
        const {id} = req.user
        console.log(id);
        const doctors = await Doctor.find({_id : {$ne : id}}).select('-password')
        //console.log(doctors);
        res.send(doctors)
    }catch(error) {
        console.log(error);
        next(new MyError(error.message || 'ocurrio un error inesperado, recarga nuevamente o intenta mas tarde'))
    }
}


export const getDoctor = async (req, res, next) => {
    try {
        //throw new Error()
        const {id} = req.params
        const doctor = await Doctor.findById({_id : id})
        console.log(doctor);
        if(!doctor) {
            return next(new MyError('no existe el doctor'))
        }
        res.send(doctor)
    }catch(error) {
        next(new MyError(error.message || 'ocurrio un error inesperado al obtener usuario' ))
    }
}


export const deleteDoctor = async (req, res, next) => {
    try {
        //throw new MyError()
        const {id} = req.params
        const doctor = await Doctor.findOneAndDelete({ _id: id })
        //console.log(doctor);
        if(!doctor) {
            return next(new MyError('no existe el doctor')) 
            //res.send({message : 'no existe el doctor'})
        }
        // despues que eliminemos a un doctor de la db tambien debemos eliminar la imagen de este doctor del directorio uploads
        if(doctor.file) {
            const firstPipe  = doctor.file.indexOf('/')
            await fs.unlink(findRoutes( doctor.file.slice(firstPipe+1) ))
        }
        res.send(doctor)
    }catch(error) {
        /* console.log(error); */
       /*  res.status(500).send({message : error.message}) */
       next(new MyError(error.message || 'ocurrio un error inesperado al eliminar al usuario')) 
    }
}
  

export const updateDoctor = async (req, res, next) => {
    try {
        // en este punto gracias al middleware de multer tendremos un
        // objeto file o files creado en nuestro objeto global request
        //console.log(req.file);
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
        if(req.user.id != id) return next(new MyError('no es tu cuenta')) 
        console.log(body);
        const doc = new Doctor()
        if(body.email) {
            const validateEmail = doc.validateEmail(body.email)
            // si pasamos la validacion del email buscamos en la db si hay algu doctor con ese mismo correo
            if(validateEmail) {
                return next(new MyError('email invalido')) 
                //res.send({message : 'email invalido'})
            }
            /* const doctFound = await Doctor.find({email : body.email,  _id : {$ne :id}})
            //console.log(doctFound);
            if(doctFound.length > 0) {
                return next(new MyError('este correo ya esta en uso'))  
                //res.send({message : 'este correo ya esta en uso'})
            } */
        }
        if(body.password) {
            const validatePassword  = doc.validatePassword(body.password)
            if(validatePassword) {
                return next(new MyError('password invalido')) 
                //res.send({message : 'password invalido'})
            }
            // si el password es valido hasheamos la nueva contraseña
            body.password = await bcrypt.hash(body.password, 10)
            //console.log(body);
        }
        
        if(req.file) {
            body.file = `${req.file.filename}`
        }
       

        const doctor = await Doctor.findById({ _id: id })
        .select('-password')
        //console.log(doctor); 
        if(!doctor) {
            return next(new MyError('no existe el doctor')) 
            //res.send({message : 'no existe el doctor'})
        } 
        if(req.file && doctor.file) {
            //const firstPipe  = doctor.file.indexOf('/')
            await fs.unlink(findRoutes( 'uploads/'+doctor.file )) 
        }
        const doctorUpdate = await Doctor.findByIdAndUpdate({ _id: id }, body, {new : true}).select('-password')
        res.send(doctorUpdate)  
    }catch(error) {
        /* console.log(error); */
        next(new MyError(error.message || 'ocurrio un error inesperado al actualizar el usuario')) 
        //res.status(404).send({message : error.message})
    }
}



/* ruta que no se utiliza */
export const createDoctor = async (req, res, next) => {

}

