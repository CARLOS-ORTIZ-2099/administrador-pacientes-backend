import mongoose from 'mongoose'
import bcrypt from 'bcrypt'


const doctorShema = new mongoose.Schema(
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
           un codigo de error 11000
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
          password : {
            type : String,
            required : [true ,'password es obligatorio'],
            minLength : [6, 'password minimo 6']
          }, 
          avatar: {
            type : String
          }

  }
)

doctorShema.pre('save', async function(next){
      try{
        const hash = await bcrypt.hash(this.password, 10)
        console.log(hash);
        //throw new Error('error al hashear la contraseña')
        this.password = hash
      }catch(error) {
        //forma de manjera un error en el metodo pre
        console.log(error);
        return next(error)
        //throw new Error('something went wrong');
      }
});

// metodos para filtrar los datos o credenciales que mande el usuario
 // antes de consultar a la Db lo ideal seria hacer un filtro 
// nosotros mismos, para asegurarnos que los datos que nos mande el usuario
// sean validos y cumplan con lo que pide el esquema, esto con el fin de no hacer llamadas innesarias a la DB
doctorShema.methods.validateEmail = function(email) {
  
  const match = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/

  if(!match.test(email)) {
      return true
  }

};

doctorShema.methods.validatePassword = function( password ) {
   console.log(password);
    if(!password ||  password.trim().length < 6) {
      return true
    }
 
 
 
};


export const Doctor = mongoose.model('Doctor', doctorShema)

