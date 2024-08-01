import { findRoutes } from "../libs/findRoutes.js"
import multer from "multer"
import ShortUniqueId from 'short-unique-id'
import path from 'path'

const uid = new ShortUniqueId({length: 10})

const location = findRoutes('uploads')

let fileStorage 

const configMulter = {

    storage : fileStorage = multer.diskStorage({

        destination: function (req, file, cb) {
            //console.log(file);
          cb(null, location) 
        },

        filename: function (req, file, cb) {
            //console.log(file);
          cb(null, uid.rnd()+'-'+file.originalname)
          
        }

    }), 


    fileFilter : function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        
        // aqui podemos poner todo tipo de logica para generar errores personalizados
        // y luego llamar a cb con un parametro de error
        if(mimetype && extname) {
            return cb(null, true)
        }
        cb(new Error('este no es un formato valido'))
    },
      
}


const upload = multer( configMulter ).single('file')


export const multerMid =  function (req, res, next) {
    upload(req, res, function (err) {
        // errores de la instancia de multer
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.     
        console.log(`${err}`.bgRed);
        return next('error de multer' /* new MyError(err) */)
      } 
      // estos de aqui se ejecutaran para errores personalizados
      else if (err) {
        // An unknown error occurred when uploading.
        console.log(`${err}`.bgBlue);
        return next('error'/* new MyError(err) */)
      }
     // res.status(201).send('received')
      // Everything went fine.
      next()
    })  

} 