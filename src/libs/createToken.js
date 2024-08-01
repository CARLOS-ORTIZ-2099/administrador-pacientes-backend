import jwt from 'jsonwebtoken'

export const createToken = (id) => {
    const token =  jwt.sign({id : id}, 'secret', {expiresIn : '2d'})
    return token
}


