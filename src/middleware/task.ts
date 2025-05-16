import type  { Request, Response, NextFunction } from 'express';
import Task, {ITask} from '../models/Task';
import { error } from 'node:console';

declare global {
  namespace Express {
    interface Request {
      task: ITask // Definir el tipo de la propiedad 'project' en la solicitud
    }
  }
}

export async function taskExist(req: Request, res: Response, next: NextFunction) {
  try {
  
    const { taskId } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud
    const task = await Task.findById(taskId); // Buscar el proyecto por su ID en la base de datos
    if (!task) {
      const error = new Error('Tarea no encontrada')
      res.status(404).json({ error: error.message })
      return
    }
    req.task = task // Asignar el proyecto encontrado a la solicitud para que esté disponible en las siguientes funciones de middleware
    next();// si no hay errores de validacion se continua con la siguiente funcion

  } catch (error) {
    res.status(500).json({ error: 'Error al validar el proyecto' })//si ocurre un error se devuelve un mensaje de error con un codigo de estado 500
  }
}


export function taskOwner(req: Request, res: Response, next: NextFunction) {
  if (req.task.project.toString() !== req.project.id.toString()) { // Verificar si el ID del proyecto de la tarea coincide con el ID del proyecto en la solicitud
    const error = new Error ('accion no valida')
    res.status(400).json({error: error.message})
    return
  }
  next(); // Si todo está bien, se continúa con la siguiente función de middleware
}

export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
  if (req.user.id.toString() !== req.project.manager.toString() ) { // Verificar si el ID del proyecto de la tarea coincide con el ID del proyecto en la solicitud
    const error = new Error ('accion no valida')
    res.status(400).json({error: error.message})
    return
  }
  next(); // Si todo está bien, se continúa con la siguiente función de middleware
}
