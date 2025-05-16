import type  { Request, Response, NextFunction } from 'express';
import Project, { IProject } from '../models/Projects'

declare global {
  namespace Express {
    interface Request {
      project: IProject // Definir el tipo de la propiedad 'project' en la solicitud
    }
  }
}

export async function validateProjectExist(req: Request, res: Response, next: NextFunction) {
 try {
  
  const { projectId } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud
    const project = await Project.findById(projectId); // Buscar el proyecto por su ID en la base de datos
    if (!project) {
      const error = new Error('Proyecto no encontrado')
      res.status(404).json({ error: error.message })
      return
    }
    req.project = project // Asignar el proyecto encontrado a la solicitud para que esté disponible en las siguientes funciones de middleware
    next();// si no hay errores de validacion se continua con la siguiente funcion

 } catch (error) {
  res.status(500).json({ error: 'Error al validar el proyecto' })//si ocurre un error se devuelve un mensaje de error con un codigo de estado 500
 }
}