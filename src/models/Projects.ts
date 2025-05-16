import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose"
import Task, { ITask } from "./Task"
import { IUser } from "./User"


// Definición del esquema de Mongoose para el modelo de proyectos. Para typescript, se define el tipo de datos que tendrá cada campo del esquema.
export interface IProject extends Document  {
  projectName: string
  clientName: string
  description: string
  tasks: PopulatedDoc<ITask & Document>[]//referencia a las tareas que pertenecen al proyecto. Se define como un array de objetos de tipo ITask.
  manager: PopulatedDoc<IUser & Document>
  team: PopulatedDoc<IUser & Document>[]
}



//schema de mongoose para el modelo de proyectos. Se define el tipo de datos que tendrá cada campo del esquema.
const ProjectSchema: Schema = new Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  tasks: [{
    type: Types.ObjectId,
    ref: 'Task'//referencia al modelo de tareas
  }],
  manager:{
    type: Types.ObjectId,
    ref: 'User'
  },
  team:[{
    type: Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true })//se añade la opción de timestamps para que mongoose cree los campos createdAt y updatedAt automáticamente.
//se define el esquema de mongoose para el modelo de proyectos. Se le pasa el tipo de datos que tendrá cada campo del esquema.

ProjectSchema.pre('deleteOne', {document: true} , async function() {
  const projectId = this._id
  if(!projectId) return
  await Task.deleteMany({project: projectId})
}) 

const Project = mongoose.model<IProject>('Project', ProjectSchema)//se define el modelo de mongoose para el esquema de proyectos. Se le pasa el tipo de datos que tendrá cada campo del esquema.
export default Project//se exporta el modelo de mongoose para el esquema de proyectos. Se le pasa el tipo de datos que tendrá cada campo del esquema.


