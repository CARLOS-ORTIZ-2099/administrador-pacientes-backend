import jwt from 'jsonwebtoken'

// funcion para validar que el usuario se halla autenticado anteriormente antes de acceder a cualquier ruta protegida
export async function validateAuth(req, res, next) {
    try{
        // accediendo a las cookies del encabezado de la solicitud
    console.log(req.cookies);
    const {tokenDoctor} = req.cookies
    console.log(tokenDoctor);
    if(!tokenDoctor) {  
        return res.send({message : 'usuario no autenticado'})
    }
    // aqui decodificamos el token, con la misma cadena que lo codificamos
    const decoded =  jwt.verify(tokenDoctor, 'secret')
    //console.log(decoded);
    req.user = decoded
    next()

    }
    catch(error) {
        console.log(error);
        res.status(500).send({message : error.message})
    }
}