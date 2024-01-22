import { Router } from "express";
import * as products from '../controller/produtosController.js';

const router = Router()

router.get('/products', products.getAllProducts)

router.get('/products/:nameProduct', products.getMaterialProduct)

router.get('/material/:nameProduct/:materialId/:cookie', products.getSizeProduct)

router.get('/tamanho/:nameProduct/:sizeId/:cookie', products.getColorProduct)

router.get('/cores/:nameProduct/:colorId/:cookie', products.getAcabamentoProduct)

router.get('/acabamento/:nameProduct/:finishingId/:cookie', products.getPriceProduct)

router.get('/combinacoes/:nameProduct', products.getCombinacoes)

router.get('/pegaritens/:pagina', products.getPageItens)


export default router;