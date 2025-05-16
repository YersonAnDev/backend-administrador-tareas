import mongoose, {Schema, Document, Types} from "mongoose";


const taskStatus = {
  PENDING: 'pending',
  ON_HOLD: 'onHold',
  IN_PROGRESS: 'inProgress',
  UNDER_REVIEW: 'underReview',
  COMPLETED: 'completed',
}as const//se define un objeto con los posibles estados de una tarea. Se define como un objeto constante para que no se pueda modificar.

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]//se define el tipo de datos que tendrá el estado de la tarea. Se define como un tipo de datos que puede ser cualquiera de los valores del objeto taskStatus.

// Definición del esquema de Mongoose para el modelo de proyectos. Para typescript, se define el tipo de datos que tendrá cada campo del esquema.
export interface ITask extends Document  {
  name: string
  description: string
  project: Types.ObjectId//referencia al proyecto al que pertenece la tarea
  status: TaskStatus//estado de la tarea. Se define como un tipo de datos que puede ser cualquiera de los valores del objeto taskStatus.
  // status: 'pending' | 'on_hold' | 'in_progress' | 'under_review' | 'completed'//estado de la tarea. Se define como un tipo de datos que puede ser cualquiera de los valores del objeto taskStatus.
  completedBy: {user: Types.ObjectId,status:TaskStatus}[]
  //notes: Types.ObjectId[]
}


export const TaskSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  project: {
    type: Types.ObjectId,
    ref: 'Project',//referencia al modelo de proyectos
  },
  status: {
    type: String,
    enum: Object.values(taskStatus),//se define como un array de los valores del objeto taskStatus.
    default: taskStatus.PENDING//se define el estado por defecto como pending
  },//finaliza el status
  completedBy: [{
    user: {
      type: Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING
    }
  }],
  /* notes: [{
    type: Types.ObjectId,
    ref: 'Note'
  }], */
}, { timestamps: true })//se añade la opción de timestamps para que mongoose cree los campos createdAt y updatedAt automáticamente.
//se define el esquema de mongoose para el modelo de proyectos. Se le pasa el tipo de datos que tendrá cada campo del esquema.

const Task = mongoose.model<ITask>('Task', TaskSchema)//se define el modelo de mongoose para el esquema de proyectos. Se le pasa el tipo de datos que tendrá cada campo del esquema.
export default Task//se exporta el modelo de mongoose para el esquema de proyectos. Se le pasa el tipo de datos que tendrá cada campo del esquema.

