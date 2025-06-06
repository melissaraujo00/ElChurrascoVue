import express from 'express';
import { listaUsuarios, usuarioId, resgistrarUsuario, inicioSesion, cierreSesion, mantenerPerfil, actulizarUsuario, eliminarUsuario, actualizarUsuarioLogeado, eliminarUsuarioLogeado} from '../controllers/loginController.js';

const router = express.Router();

//get all user
router.get( '/usuario', listaUsuarios);

//get a user
router.get( '/usuario/:id', usuarioId);

//post register user
router.post( '/register', resgistrarUsuario);

//post signin user
router.post('/signin', inicioSesion);

//post logout user
router.post('/logout', cierreSesion);

//get keep logged in
router.get('/profile', mantenerPerfil);

//put update user
router.put('/usuario/:id', actulizarUsuario);

//put update user logeado
router.put('/actualizarUsuarioLogeado', actualizarUsuarioLogeado);

//delete user
router.delete('/usuario/:id', eliminarUsuario);

//delete user logeado
router.delete('/eliminarUsuarioLogeado', eliminarUsuarioLogeado);


export default router;