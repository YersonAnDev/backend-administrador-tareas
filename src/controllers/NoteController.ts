import type { Request, Response } from "express"
import Note, { INote } from "../models/Note"



export class NoteController {

  static createNote = async ( req: Request, res: Response ) => {

    //const { content } = req.body as INote
    /* const note = new Note()
    note.content = content
    note.createdBy = req.user.id
    note.task = req.task.id */

    //req.task.notes.push(note.id)
    //const note = new Note()

    res.send('funciona')

   /*  note.content = content
    note.createdBy = req.user.id
    req.task.notes.push(note.id)
    

    try {

      await Promise.allSettled([req.task.save(), note.save()])
      res.send('funciona')
      
    } catch (error) {
      res.status(500).json({error: 'hubo una falla'})
    } */

  } 

}


