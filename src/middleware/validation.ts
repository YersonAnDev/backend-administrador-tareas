import type {  Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';// Importa la función validationResult desde express-validator para manejar la validación de los datos de entrada


export const handleInputErros = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)//aqui se obtiene el resultado de la validacion de los datos que se reciben en la peticion
  if (!errors.isEmpty()) {//si hay errores en la validacion se devuelve un mensaje de error con un codigo de estado 400
    //return res.status(400).json({ errors: errors.array() });//se devuelve un mensaje de error con un codigo de estado 400
    res.status(400).json({ errors:errors.array()})//se devuelve un mensaje de error con un codigo de estado 400
    return//se detiene la ejecucion de la funcion
  }
  next();//si no hay errores se continua con la siguiente funcion del middleware
}







