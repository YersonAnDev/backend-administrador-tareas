import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/authController'
import { handleInputErros } from '../middleware/validation'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/create-account', 
  body('name').notEmpty().withMessage('El nombre no puede esta vacio'),
  body('password').isLength({min:8}).withMessage('Contrasenia no puede tener menos de 8 caracteres'),
  body('password_confirmation').custom((value,{req}) => {//comparar entre dos valores... en este caso compara que las contresenias sean iguales
    if(value !== req.body.password){
      throw new Error('las contrasenias no coinciden')
    }
    return true
  }),
  body('email').isEmail().withMessage('El correo electronico no es valido'),
  handleInputErros,
  AuthController.createAccount
)

router.post('/confirm-account', 
  body('token').notEmpty().withMessage('El token no puede ir vacio'),
  handleInputErros,
  AuthController.confirmAccount
)

router.post('/login', 
  body('email').isEmail().withMessage('El correo electronico no es valido'),
  body('password').notEmpty().withMessage('La contrasenia es obligatoria'),
  handleInputErros,
  AuthController.login
)

router.post('/request-code', 
  body('email').isEmail().withMessage('El correo electronico no es valido'),
  handleInputErros,
  AuthController.requestConfirmationCode
)

router.post('/forgot-password', 
  body('email').isEmail().withMessage('El correo electronico no es valido'),
  handleInputErros,
  AuthController.forgotPassword
)

router.post('/validate-token', 
  body('token').notEmpty().withMessage('El token no puede ir vacio'),
  handleInputErros,
  AuthController.validateToken
)

router.post('/update-password/:token', 
  param('token').isNumeric().withMessage('Token no valido'),
  body('password').isLength({min:8}).withMessage('Contrasenia no puede tener menos de 8 caracteres'),
  body('password_confirmation').custom((value,{req}) => {//comparar entre dos valores... en este caso compara que las contresenias sean iguales
    if(value !== req.body.password){
      throw new Error('las contrasenias no coinciden')
    }
    return true
  }),
  AuthController.updatePasswordWithToken
)

router.get('/user',
  authenticate,

  AuthController.user
)


// rutas de perfil
router.put('/profile',
  authenticate,

  body('name').notEmpty().withMessage('El nombre no puede esta vacio'),
  body('email').isEmail().withMessage('El correo electronico no es valido'),

  AuthController.updateProfile
)

router.post('/update-password',
  authenticate,
  body('current_password').notEmpty().withMessage('La contrasenia actual no puede ir vacio'),
  body('password').isLength({min:8}).withMessage('Contrasenia no puede tener menos de 8 caracteres'),
  body('password_confirmation').custom((value,{req}) => {//comparar entre dos valores... en este caso compara que las contresenias sean iguales
    if(value !== req.body.password){
      throw new Error('las contrasenias no coinciden')
    }
    return true
  }),
  handleInputErros,
  AuthController.updatePassword
)

router.post('/check-password',
  authenticate,
  body('password').notEmpty().withMessage('La contrasenia no puede ir vacio'),
  handleInputErros,

  AuthController.checkPassword
)



export default router