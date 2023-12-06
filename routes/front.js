import { Router } from "express";
import products from '../model/products.js';

const router = Router()

router.get('/produtos', (req, res) => {
  res.render('produtos', {});
})

router.get('/produtos/:produto', (req, res) => {
  const {produto} = req.params;
  const productSelected = products.filter(item => item.produto == produto)
  res.render('orcamento', {produto: productSelected[0]});
})

export default router