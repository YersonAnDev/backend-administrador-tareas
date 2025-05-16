import { Request, Response } from 'express';
import Project from '../models/Projects';


export class ProjectController {

  
  static createProject = async (req: Request, res: Response) => {
    
    //aqui se puede agregar la logica para crear un nuevo proyecto

    const project = new Project(req.body)//se crea una nueva instancia del modelo Project con los datos que se reciben en el cuerpo de la peticion
    //forma recomendada de hacerlo es usando el metodo create del modelo Projects y realizar otras acciones como la validacion de los datos antes de guardarlos en la base de datos


    //asignar un manager 
    project.manager = req.user.id

    try {

      await project.save()//se guarda el nuevo proyecto en la base de datos

      //await Project.create(req.body)//se guarda el nuevo proyecto en la base de datos otra forma de hacerlo es usando el metodo create del modelo Project
      //res.status(201).json(project)//se devuelve el nuevo proyecto creado con un codigo de estado 201
      res.send('Proyecto creado ')//se devuelve un mensaje de exito
    } catch (error) {
      //res.status(500).json({ message: 'Error al crear el proyecto' })//si ocurre un error se devuelve un mensaje de error con un codigo de estado 500
      console.log(error)//se imprime el error en la consola
    }
  }


  
  
  static getAllProjects = async (req: Request, res: Response) => {

    try {
      const projects = await Project.find({//se obtienen todos los proyectos de la base de datos
        $or: [
          {manager: {$in: req.user.id}},//solo mostras los proyectos que pertenecen al usuario autenticado
          {team: {$in: req.user.id}}
        ]
      })
      res.status(200).json(projects)//se devuelve la lista de proyectos con un codigo de estado 200
    } catch (error) {
      //res.status(500).json({ message: 'Error al obtener los proyectos' })//si ocurre un error se devuelve un mensaje de error con un codigo de estado 500
      console.log(error)//se imprime el error en la consola
    }
  }






  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params//se obtiene el id del proyecto que se recibe en la url

    try {
      const project = await (await Project.findById(id)).populate('tasks')//se busca el proyecto por su id y se obtienen las tareas asociadas al proyecto
      if (!project) {//si no se encuentra el proyecto se devuelve un mensaje de error con un codigo de estado 404
        const error = new Error('Proyecto no encontrado')//se crea un nuevo error con el mensaje de error
        res.status(404).json({ error: error.message })//se devuelve un mensaje de error con un codigo de estado 404
        return//se detiene la ejecucion de la funcion
      }

      if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)){
        const error = new Error('Accion no valida')
        res.status(404).json({ error: error.message })
        return
      }
      

      res.json(project)//se devuelve el proyecto encontrado
    } catch (error) {
      //res.status(500).json({ message: 'Error al obtener el proyecto' })//si ocurre un error se devuelve un mensaje de error con un codigo de estado 500
      console.log(error)//se imprime el error en la consola
    }
  }





  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params//se obtiene el id del proyecto que se recibe en la url

    try {
      const project = await Project.findById(id)//se busca el proyecto por su id y se actualizan los datos del proyecto en la base de datos
      if (!project) {//si no se encuentra el proyecto se devuelve un mensaje de error con un codigo de estado 404
        const error = new Error('Proyecto no encontrado')//se crea un nuevo error con el mensaje de error
        res.status(404).json({ error: error.message })//se devuelve un mensaje de error con un codigo de estado 404
        return//se detiene la ejecucion de la funcion
      }

      if(project.manager.toString() !== req.user.id.toString()){
        const error = new Error('Solo el manager puede actualizar un proyecto')
        res.status(404).json({ error: error.message })
        return
      }


      project.clientName = req.body.clientName//se actualiza el nombre del cliente con el nuevo nombre que se recibe en el cuerpo de la peticion
      project.projectName = req.body.projectName//se actualiza el nombre del proyecto con el nuevo nombre que se recibe en el cuerpo de la peticion
      project.description = req.body.description//se actualiza la descripcion del proyecto con la nueva descripcion que se recibe en el cuerpo de la peticion
      await project.save()//se guarda el proyecto actualizado en la base de datos
      res.status(200).json({ message: 'Proyecto actualizado' })//se devuelve un mensaje de exito con un codigo de estado 200
    } catch (error) {
      //res.status(500).json({ message: 'Error al actualizar el proyecto' })//si ocurre un error se devuelve un mensaje de error con un codigo de estado 500
      console.log(error)//se imprime el error en la consola
    }
  }



  //eliminar un proyecto por su id

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params//se obtiene el id del proyecto que se recibe en la url

    try {
      const project = await Project.findById(id)//se busca el proyecto por su id y se elimina de la base de datos
      if (!project) {//si no se encuentra el proyecto se devuelve un mensaje de error con un codigo de estado 404
        const error = new Error('Proyecto no encontrado')//se crea un nuevo error con el mensaje de error
        res.status(404).json({ error: error.message })//se devuelve un mensaje de error con un codigo de estado 404
        return//se detiene la ejecucion de la funcion
      }

      if(project.manager.toString() !== req.user.id.toString()){
        const error = new Error('Solo el manager puede eliminar un proyecto')
        res.status(404).json({ error: error.message })
        return
      }
      


      await project.deleteOne()//se elimina el proyecto de la base de datos
      res.status(200).json({ message: 'Proyecto eliminado' })//se devuelve un mensaje de exito con un codigo de estado 200
    } catch (error) {
      //res.status(500).json({ message: 'Error al eliminar el proyecto' })//si ocurre un error se devuelve un mensaje de error con un codigo de estado 500
      console.log(error)//se imprime el error en la consola
    }
  }

}