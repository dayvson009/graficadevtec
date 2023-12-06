import { Router } from "express";
import products from '../model/products.js';

const router = Router()

router.get('/productssss', (req, res) => {
  res.json(products)
})

export default router