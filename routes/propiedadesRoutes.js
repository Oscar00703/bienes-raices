import Express from "express";
import { admin } from '../controllers/propiedadController.js'

const router = Express.Router();

router.get('/mis-propiedades', admin)

export default router