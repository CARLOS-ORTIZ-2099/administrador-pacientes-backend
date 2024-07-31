import mongoose from 'mongoose'
import { Schema } from 'zod'


const patientShema = new mongoose.Schema(
        {
          name : { 
            type : String, required : [true, 'name obligatorio']
          },

          lastName : {
            type : String, required : [true, 'lastname obligatorio']
          } ,
        /* segun la documentacion unique propiedad no es una validacion como tal de mongoose
           a diferencia de las otras validaciones del esquema como min, max, required, ect, esta
           unique es propio de mongo db es por eso que si se rompe esta restriccion obtendremos
           un codigo de error E11000
        */
          cedula : {
            type : String, required : [true, 'cedula es obligatorio'],
            unique: true,
            minLength : [8, 'minimo 8 caracteres'],
            maxLength : [8, 'maximo 8 caracteres']
          } , 

          email : {
            type : String, required : [true,'email es obligatorio'],
            unique : true,
            match : [/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, 'inserta un email valido'] 
          },

          symptoms : {
            type : String,
            required : true
          },
          date : {
            type : Date,
            required : true
          },
          doctor : { type : Schema.Types.ObjectId, ref : 'Doctor' }

  }
)

export const Patient = mongoose.model('Patient', patientShema)