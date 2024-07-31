import { Doctor } from "../models/Doctor.js";


export const getDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find()
        console.log(doctors);
        res.send(doctors)
    }catch(error) {
        console.log(error);
        res.status(500).send({message : error})
    }
}


export const getDoctor = async (req, res, next) => {
    try {
        const {id} = req.params
        const doctor = await Doctor.findById({_id : id})
        console.log(doctor);
        if(!doctor) {
            return res.send({message : 'no existe el doctor'})
        }
        res.send(doctor)
    }catch(error) {
        /* console.log(error); */
        res.status(500).send({message : error})
    }
}


export const deleteDoctor = async (req, res, next) => {
    try {
        const {id} = req.params
        const doctor = await Doctor.findOneAndDelete({ _id: id })
        console.log(doctor);
        if(!doctor) {
            return res.send({message : 'no existe el doctor'})
        }
        res.send(doctor)
    }catch(error) {
        /* console.log(error); */
        res.status(500).send({message : error})
    }
}

export const updateDoctor = async (req, res, next) => {
    try {
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
        const doc = new Doctor()
        if(body.email) {
            const validateEmail = doc.validateEmail(body.email)
            // si pasamos la validacion del email buscamos en la db si hay algu doctor con ese mismo correo
            if(validateEmail) {
                return res.send({message : 'email invalido'})
            }
            const doctFound = await Doctor.find({email : body.email})
            console.log(doctFound);
            if(doctFound.length > 0) {
                return res.send({message : 'este correo ya esta en uso'})
            }
        }
        if(body.password) {
            const validatePassword  = doc.validatePassword(body.password)
            if(validatePassword) {
                return res.send({message : 'password invalido'})
            }
        }
            
       

        const doctor = await Doctor.findByIdAndUpdate({ _id: id }, body)
        console.log(doctor);
        if(!doctor) {
            return res.send({message : 'no existe el doctor'})
        }
        res.send(doctor)
    }catch(error) {
        /* console.log(error); */
        res.status(500).send({message : error.message})
    }
}




export const createDoctor = async (req, res, next) => {

}

