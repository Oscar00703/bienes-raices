import express  from 'express';
import { fromularioLogin, fromularioRegistro, fromularioOlvidePassword, registrar } from '../controllers/usuarioController.js'

const router = express();


router.get('/login', fromularioLogin );
router.get('/registro', fromularioRegistro );
router.post('/registro', registrar );
router.get('/olvide-password', fromularioOlvidePassword );

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