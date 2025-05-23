import type { Request,Response } from "express";
import User from "../models/User";
import Project from "../models/Projects";
import { populate } from "dotenv";


export class TeamMemberController {
  static findMemberByEmail = async ( req: Request , res: Response ) => {
    const { email } = req.body

    const user = await User.findOne({email} ).select('id email name') // encotrar el usuario// con el selct solo selecciono los datos necesarios
    if(!user){
      const error = new Error('Usuario No encontrado')
      res.status(404).json({error: error.message})
    }
    res.json(user)

  }

  static getProjectTeam = async ( req: Request , res: Response ) => {
    const project = await Project.findById(req.project.id).populate({
      path: 'team',
      select: 'id email name'
    })

    res.send(project.team)
    

  }


  static addMemberById = async ( req: Request , res: Response ) => {
    const { id } = req.body

    const user = await User.findById(id).select('id') 
    if(!user){
      const error = new Error('Usuario No encontrado')
      res.status(404).json({error: error.message})
      return
    }
    if(req.project.team.some(team => team.toString() === user.id.toString() )){
      const error = new Error('Ya esta agregado este colaborador al proyecto')
      res.status(409).json({error: error.message})
      return
    }
    req.project.team.push(user.id)
    await req.project.save()
    res.send('Colabaorador agregado')
  }

  
  static removedMemberById = async ( req: Request , res: Response ) => {
    const { userId } = req.params

    if(!req.project.team.some(team => team.toString() === userId )){
      const error = new Error('el colaborador no esta en el proyecto')
      res.status(409).json({error: error.message})
      return
    }

    req.project.team = req.project.team.filter( teamMember => teamMember.toString() !== userId )
    await req.project.save()

    res.send('colaborador elimindao')

  }
}

