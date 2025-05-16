import type { Request, Response } from 'express'
import Task from '../models/Task'


export class TaskController {
  // Crear una nueva tarea
  static createTask = async (req: Request, res: Response) => {
    
    try {
      const task = new Task(req.body) // Crear una nueva tarea con los datos del cuerpo de la solicitud
      task.project = req.project.id // Asignar el ID del proyecto a la tarea
      req.project.tasks.push(task.id) // Agregar la tarea al array de tareas del proyecto

      await Promise.allSettled([task.save(), req.project.save()]) // Guardar la tarea y el proyecto de forma concurrente
      
      res.send('tarea creada exitosamente'); // Enviar una respuesta de éxito
    } catch (error) {
      //res.status(500).json({ message: 'Error al crear el proyecto' })//si ocurre un error se devuelve un mensaje de error con un codigo de estado 500
      //console.log(error)//se imprime el error en la consola
      res.status(500).json({ message: 'Error crear tarea al proyecto' }) // Si ocurre un error, enviar un mensaje de error
    }
  }



  // Obtener todas las tareas de un proyecto
  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate('project') // Buscar todas las tareas asociadas al proyecto
      res.json(tasks) // Enviar las tareas como respuesta
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las tareas del proyecto' }) // Si ocurre un error, enviar un mensaje de error
    }
  }



  // Obtener una tarea por su ID
  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.task.id).populate({
        path: 'completedBy.user',
        select: 'id name email'
      })

      res.json(task) // Enviar la tarea como respuesta
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la tarea' }) // Si ocurre un error, enviar un mensaje de error
    }
  }



  // Actualizar una tarea por su ID

  static updateTask = async (req: Request, res: Response) => {
    try {

      // Actualizar los campos de la tarea con los datos del cuerpo de la solicitud
      req.task.name = req.body.name   // Actualizar el nombre de la tarea si se proporciona uno nuevo
      req.task.description = req.body.description // Actualizar la descripción de la tarea si se proporciona una nueva
      await req.task.save() // Guardar los cambios en la tarea
      res.send('tarea actualizada exitosamente') // Enviar la tarea actualizada como respuesta
    }
    catch (error) {
      res.status(500).json({ message: 'Error al actualizar la tarea' }) // Si ocurre un error, enviar un mensaje de error
    }
  }



  // Eliminar una tarea por su ID

  static deteteTask = async (req: Request, res: Response) => {
    try {
      

      req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString()) // Filtrar la tarea eliminada del array de tareas del proyecto

      //await task.deleteOne() // Eliminar la tarea de la base de datos
      //await req.project.save() // Guardar los cambios en el proyecto

      await Promise.allSettled([req.task.deleteOne(), req.project.save()]) // Guardar la tarea y el proyecto de forma concurrente

      res.send('tarea actualizada exitosamente') // Enviar la tarea actualizada como respuesta
    }
    catch (error) {
      res.status(500).json({ message: 'Error al actualizar la tarea' }) // Si ocurre un error, enviar un mensaje de error
    }
  }

  // Completar una tarea por su ID

  static updateStatus = async (req: Request, res: Response) => {
    try {

      const {status} = req.body // Obtener el nuevo estado de la tarea del cuerpo de la solicitud

      req.task.status = status // Actualizar el estado de la tarea si se proporciona uno nuevo

      const data = {
        user: req.user.id,
        status
      }
      req.task.completedBy.push(data)
      await req.task.save() // Guardar los cambios en la tarea
      res.send('tarea actualizada exitosamente') // Enviar la tarea actualizada como respuesta
    }
    catch (error) {
      res.status(500).json({ message: 'Error al actualizar la tarea' }) // Si ocurre un error, enviar un mensaje de error
    }
  }



}
