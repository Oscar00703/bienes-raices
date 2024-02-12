import express  from 'express';
import { fromularioLogin, fromularioRegistro, fromularioOlvidePassword, registrar, confirmar, resetPassword, comprobarToken, nuevoPassword,
    autenticar } from '../controllers/usuarioController.js'

const router = express();

router.get('/login', fromularioLogin);
router.post('/login', autenticar);

router.get('/login', fromularioLogin );
router.get('/registro', fromularioRegistro );
router.post('/registro', registrar );

router.get('/confirmar/:token', confirmar);

router.get('/olvide-password', fromularioOlvidePassword );

router.post('/olvide-password', resetPassword );

// Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

export default router;





// router.post('/', (req, res) => {
//     res.json({msg:'Welcome nosotros'});
// });

// router.route('/')
//     .get(function(req, res){
//         res.json({msg: 'Hola'})
//     })
//     .post(function(req, res) {
//         res.json({msg:'Welcome nosotros'});
//     })