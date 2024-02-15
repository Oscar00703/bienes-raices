import Express from "express";
import { admin, crear, guardar } from '../controllers/propiedadController.js'

const router = Express.Router();

router.get('/mis-propiedades', admin)
router.get('/propiedades/crear', crear)
router.post('/propiedades/crear', guardar)


export default router