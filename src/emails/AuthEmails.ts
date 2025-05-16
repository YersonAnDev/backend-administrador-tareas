import { transporter } from "../config/nodemailer"

interface IEmail{
  email: string
  name: string
  token: string
}

export class AuthEmail {

  static sendConfimarionEmail = async (user:IEmail)=> {
    //enviar email
    const info =await transporter.sendMail({
      from: 'UpTask <admin@uptask.com>',
      to: user.email,
      subject: 'UpTask - confirma tu cuenta',
      text: 'UpTask - confirma tu cuenta',
      html: `<p>Hola: ${user.name}, has creado exitosamente tu cuenta en UpTask, bienvenido ya casi esta lista tu cuenta, el siguiente paso que es confirmar tu cuenta</p>\
        <p>dar clic en este enlace:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirma tu cuenta</a>
        <p> Ingresa el codigo: <b>${user.token}</b></p>
        <p>Este token solo tiene una duracion de 10 minutos</p>

      `
    })
  }

  static sendPasswordResetToken = async (user:IEmail)=> {
    //enviar email
    const info =await transporter.sendMail({
      from: 'UpTask <admin@uptask.com>',
      to: user.email,
      subject: 'UpTask - Restablece tu contrasenia',
      text: 'UpTask - Restablece tu contrasenia',
      html: `<p>Hola: ${user.name}, has solicitado restablecer tu contrasenia</p>\
        <p>dar clic en este enlace:</p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer contrasenia</a>
        <p> Ingresa el codigo: <b>${user.token}</b></p>
        <p>Este token solo tiene una duracion de 10 minutos</p>

      `
    })
  }
  
}

