import mongoose from 'mongoose'



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
            required : true,
            default : Date.now
          },
          doc : { 
            type : mongoose.Schema.Types.ObjectId, ref : 'Doctor' 
          }

  }
)


patientShema.methods.validateEmail = function(email) {
  
  const match = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/

  if(!match.test(email)) {
      return true
  }

};



export const Patient = mongoose.model('Patient', patientShema)