import bcrypt from 'bcrypt'



export const hashPassword = async (password: string) =>{//hasheo de la contrasenia
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password,salt)

}



export const checkPassword = async (enteredPassword:string,storedHash:string) => {//contrasenia ingresada por el usuario y al otro lado la contrasenia hasheada almacenada en la base de datos
  return await bcrypt.compare(enteredPassword,storedHash)//comparar dos datos y su resultasdo es true o false
}




