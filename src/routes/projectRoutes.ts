import { Router } from 'express';
import { body, param } from 'express-validator';// Importa el validador de express-validator para validar los datos de entrada
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErros } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { validateProjectExist } from '../middleware/project';
import { hasAuthorization, taskExist, taskOwner } from '../middleware/task';
import { authenticate } from '../middleware/auth';
import { TeamMemberController } from '../controllers/TeamController'; 
import { NoteController } from '../controllers/NoteController';


const router = Router();// aqui se crea la instancia de router

router.use(authenticate)

// aqui se definen las rutas para los proyectos. Se le pasa el controlador que se encargara de manejar la peticion y la respuesta.
// Se le pasa el controlador que se encargara de manejar la peticion y la respuesta.
router.post('/', 
  // aqui se definen las validaciones para los campos que se reciben en el cuerpo de la peticion. Se le pasa el controlador que se encargara de manejar la peticion y la respuesta.
  body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),// aqui se valida que el campo projectName no este vacio y se le asigna un mensaje de error en caso de que no cumpla con la validacion
  body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),// aqui se valida que el campo clientName no este vacio y se le asigna un mensaje de error en caso de que no cumpla con la validacion
  body('description').notEmpty().withMessage('La descripcion es obligatoria'),// aqui se valida que el campo description no este vacio y se le asigna un mensaje de error en caso de que no cumpla con la validacion
  handleInputErros,// aqui se llama a la funcion que maneja los errores de entrada. Se le pasa el controlador que se encargara de manejar la peticion y la respuesta.
  ProjectController.createProject
)// aqui se define la ruta para crear un nuevo proyecto. Se le pasa el controlador que se encargara de manejar la peticion y la respuesta.




router.get('/',  ProjectController.getAllProjects)// aqui se define la ruta para obtener todos los proyectos. Se le pasa el controlador que se encargara de manejar la peticion y la respuesta.


router.get('/:id', 
  param('id').isMongoId().withMessage('El id del proyecto no es valido'),// aqui se valida que el id del proyecto sea un id de mongo valido y se le asigna un mensaje de error en caso de que no cumpla con la validacion
  handleInputErros,// aqui se llama a la funcion que maneja los errores de entrada. Se le pasa el controlador que se encargara de manejar la peticion y la respuesta.
  ProjectController.getProjectById
)// aqui se define la ruta para obtener un proyecto por su id. Se le pasa el controlador que se encargara de manejar la peticion y la respuesta.


router.put('/:id',
  param('id').isMongoId().withMessage('El id del proyecto no es valido'),// aqui se valida que el id del proyecto sea un id de mongo valido y se le asigna un mensaje de 
  // error en caso de que no cumpla con la validacion
  body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('description').notEmpty().withMessage('La descripcion es obligatoria'),
  handleInputErros,
  ProjectController.updateProject
)



router.delete('/:id', 
  param('id').isMongoId().withMessage('El id del proyecto no es valido'),
  handleInputErros,
  ProjectController.deleteProject
)



//rutas de las tareas de un proyecto

router.param('projectId',validateProjectExist)// aqui se valida que el id del proyecto sea un id de mongo valido y se le asigna un mensaje de error en caso de que no cumpla con la validacion

router.post('/:projectId/tasks',
  hasAuthorization,
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatoria'),
  body('description').notEmpty().withMessage('La descripcion es obligatoria'),
  handleInputErros,
  TaskController.createTask//se llama al controlador que se encargara de manejar la peticion y la respuesta.
)


router.get('/:projectId/tasks',
  TaskController.getProjectTasks//se llama al controlador que se encargara de manejar la peticion y la respuesta.
)

router.param('taskId', taskExist)// aqui se valida que el id del proyecto sea un id de mongo valido y se le asigna un mensaje de error en caso de que no cumpla con la validacion
router.param('taskId', taskOwner)// aqui se valida que el id del proyecto sea un id de mongo valido y se le asigna un mensaje de error en caso de que no cumpla con la validacion

router.get('/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('El id del proyecto no es valido'),
  handleInputErros,
  TaskController.getTaskById//se llama al controlador que se encargara de manejar la peticion y la respuesta.
)



router.put('/:projectId/tasks/:taskId',
  hasAuthorization,
  param('taskId').isMongoId().withMessage('El id del proyecto no es valido'),
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatoria'),
  body('description').notEmpty().withMessage('La descripcion es obligatoria'),
  handleInputErros,
  TaskController.updateTask//se llama al controlador que se encargara de manejar la peticion y la respuesta.
)




router.delete('/:projectId/tasks/:taskId',
  hasAuthorization,
  param('taskId').isMongoId().withMessage('El id del proyecto no es valido'),
  handleInputErros,
  TaskController.deteteTask//se llama al controlador que se encargara de manejar la peticion y la respuesta.
)

router.post('/:projectId/tasks/:taskId/status',
  param('taskId').isMongoId().withMessage('El id del proyecto no es valido'),
  body('status').notEmpty().withMessage('El estado de la tarea es obligatoria'),
  handleInputErros,
  TaskController.updateStatus//se llama al controlador que se encargara de manejar la peticion y la respuesta.
)

//routas colaboradores

router.post('/:projectId/team/find',
  body('email').isEmail().toLowerCase().withMessage('Este correo no es valido'),
  handleInputErros,

  TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',

  TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
  body('id').isMongoId().withMessage('Id no valido'),
  handleInputErros,

  TeamMemberController.addMemberById
)


router.delete('/:projectId/team/:userId',
  param('userId').isMongoId().withMessage('Id no valido'),
  handleInputErros,

  TeamMemberController.removedMemberById
)

/// rutas de las notas 


router.post('/:projectId/tasks/:tasksId/notes',
  body('content').notEmpty().withMessage('La nota no puede ir vacia'),
  handleInputErros,
  NoteController.createNote
)









export default router//se exporta el router para que pueda ser utilizado en otros archivos. Se le pasa el controlador que se encargara de manejar la peticion y la respuesta.