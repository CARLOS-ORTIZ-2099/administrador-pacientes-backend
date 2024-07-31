import mongoose from "mongoose";
import colors from 'colors'

export async function db() {
    try {
      await  mongoose.connect('mongodb://localhost:27017/citas-pacientes')
      console.log(`connected successfully to db`.cyan);
    }catch(error) {
        //console.log(error);
        throw new Error('error unexpected try connected to db'.red)
    }
}
