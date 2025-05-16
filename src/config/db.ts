import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    //const baseDatos = 'mongodb+srv://yersonandev:as6IKYMDmlos0Xji@cluster0.gmtxpje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    const {connection} = await mongoose.connect(process.env.DATABASE_URL)
    const url = `${connection.host}:${connection.port}`
    console.log(colors.magenta.underline(`MongoDB esta conectado en: ${url}`))
  } catch (error) {
    console.log(colors.red('Error al conectar a la base de datos: '));
    exit(1);
  }

}
//mongodb+srv://yersonandev:as6IKYMDmlos0Xji@cluster0.gmtxpje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
