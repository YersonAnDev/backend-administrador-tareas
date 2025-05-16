import type { Request,Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmails"
import { generarteJWT } from "../utils/jwt"



export class AuthController {

  static createAccount = async (req:Request,res:Response)=>{

    try {
      const {password,email} = req.body
      
      const userExist = await User.findOne({email})

      if(userExist){
        const error = new Error('El usuario ya Existe')
        res.status(409).json({error: error.message})
        return
      }
      //crear nuevo usuario
      const user = new User(req.body)
      //hash contrasenia
      user.password = await hashPassword(password)
      //generar el token
      const token = new Token()
      token.token = generateToken()
      token.user = user.id
      //enviar email
      AuthEmail.sendConfimarionEmail({
        email: user.email,
        name: user.name,
        token: token.token

      })

      await Promise.allSettled([user.save(),token.save()])
      res.send('Cuenta creada Exitosamente, revisa tu correo para confirmar')
      
    } catch (error) {
      res.status(500).json({error: 'hubo un error al crear el usuaio'})
    }
    
  }


  static confirmAccount = async (req:Request,res:Response)=>{

    try {
      const { token } = req.body
      const tokenExist = await Token.findOne({token})

      if(!tokenExist){
        const error = new Error('Token no valido')
        res.status(404).json({error: error.message})
        return
      }

      const user = await User.findById(tokenExist.user)
      user.confirmed = true

      await Promise.allSettled([user.save(),tokenExist.deleteOne()])

      res.send('Cuenta confirmada con Exito')

    } catch (error) {
      res.status(500).json({error: 'hubo un error al crear el usuaio'})
    }
  }


  static login = async (req:Request,res:Response)=>{

    try {
      const {email,password} = req.body
      const user = await User.findOne({email})
      
      if(!user){
        const error = new Error('Usuario no existente')
        res.status(404).json({error: error.message})
        return
      }
      if(!user.confirmed){

        const token = new Token()
        token.user = user.id
        token.token = generateToken()
        await token.save()

        AuthEmail.sendConfimarionEmail({
          email: user.email,
          name: user.name,
          token: token.token
  
        })

        const error = new Error('Usuario no ha sido confirmado, hemos enviado un mail de confirmacion')
        res.status(401).json({error: error.message})
        return
      }
      
      //revisar contrasenia
      
      const isPasswordCorrect = await checkPassword(password,user.password)
      if(!isPasswordCorrect){
        const error = new Error('Contrasenia es incorrecta')
        res.status(401).json({error: error.message})
        return
        
      }
      
      const token = generarteJWT({id: user.id})

      res.send(token)

    } catch (error) {
      res.status(500).json({error: 'hubo un error al crear el usuaio'})
    }
  }



  static requestConfirmationCode = async (req:Request,res:Response)=>{

    try {
      const {email} = req.body
      
      const user = await User.findOne({email})

      if(!user){
        const error = new Error('El usuario no esta registrado')
        res.status(404).json({error: error.message})
        return
      }
      
      if (user.confirmed){
        const error = new Error('El usuario ya esta confirmado')
        res.status(403).json({error: error.message})
        return

      }

      //generar el token
      const token = new Token()
      token.token = generateToken()
      token.user = user.id
      //enviar email
      AuthEmail.sendConfimarionEmail({
        email: user.email,
        name: user.name,
        token: token.token

      })

      await Promise.allSettled([user.save(),token.save()])
      res.send('Se envio un nuevo token revisa tu correo electronico')
      
    } catch (error) {
      res.status(500).json({error: 'hubo un error al crear el usuaio'})
    }
    
  }


  static forgotPassword = async (req:Request,res:Response)=>{

    try {
      const {email} = req.body
      
      const user = await User.findOne({email})

      if(!user){
        const error = new Error('El usuario no esta registrado')
        res.status(404).json({error: error.message})
        return
      }


      //generar el token
      const token = new Token()
      token.token = generateToken()
      token.user = user.id
      await token.save()
      //enviar email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token

      })

      res.send('Se envio un nuevo token revisa tu correo electronico')
      
    } catch (error) {
      res.status(500).json({error: 'hubo un error al crear el usuaio'})
    }
    
  }


  static validateToken = async (req:Request,res:Response)=>{

    try {
      const { token } = req.body

      const tokenExist = await Token.findOne({token})
      if(!tokenExist){
        const error = new Error('Token no valido')
        res.status(404).json({error: error.message})
        return
      }

      res.send('Token valido, defini tu nueva contrasenia')

    } catch (error) {
      res.status(500).json({error: 'hubo un error al crear el usuaio'})
    }
  }
  static updatePasswordWithToken = async (req:Request,res:Response)=>{

    try {
      const { token } = req.params
      const { password } = req.body

      const tokenExist = await Token.findOne({token})
      if(!tokenExist){
        const error = new Error('Token no valido')
        res.status(404).json({error: error.message})
        return
      }

      const user = await User.findById(tokenExist.user)//identificar usuario por el id
      user.password = await hashPassword(password)

      await Promise.allSettled([user.save(), tokenExist.deleteOne()])

      res.send('nueva contrasenia creado con exito')

    } catch (error) {
      res.status(500).json({error: 'hubo un error al crear el usuaio'})
    }
  }
  static user = async (req:Request,res:Response)=>{
    res.json(req.user)
    return
    
  }


  static updateProfile = async (req:Request,res:Response)=>{
    
    const {name, email} = req.body
    const userExist = await User.findOne({email})
    if(userExist && userExist.id.toString() !== req.user.id.toString() ) {
      const error = new Error('Correo electronico ya esta registrado')
      res.status(409).json({error: error.message})
      return
    }
    req.user.name = name
    req.user.email = email
    try {
      await req.user.save()
      res.send('Perfil Actializado Exitosamente')
    } catch (error) {
      res.status(500).send('hubo un error')
    }
  }

  static updatePassword = async (req:Request,res:Response)=>{
    
    const { current_password, password } = req.body

    const user = await User.findById(req.user.id)

    const isPasswordCorrect = await checkPassword(current_password, user.password)

    if(!isPasswordCorrect) {
      const error = new Error('Contrasenia actal incorrecta')
      res.status(409).json({error: error.message})
      return
    }

    try {
      user.password = await hashPassword(password)
      await user.save()
      res.send('Contrasenia Actualizada Exitosamente')
      
    } catch (error) {
      res.status(500).json({error: error.message})
    }

    
  }

  static checkPassword = async (req:Request,res:Response)=>{
    
    const { password } = req.body

    const user = await User.findById(req.user.id)

    const isPasswordCorrect = await checkPassword(password, user.password)

    if(!isPasswordCorrect) {
      const error = new Error('Contrasenia incorrecta')
      res.status(409).json({error: error.message})
      return
    }

    res.send('Contrasenia Correcta')

    
  }





}



