import products from '../model/products.js';
import axios from 'axios';

const filterProduct = (prod) => products.filter(item => item.produto == prod)[0]

export  const getAllProducts = (req, res) => {
    res.json(products.map(item => ({produto:item.produto})))
}

export const getMaterialProduct = async (req, res) => {
  const {nameProduct} = req.params
  const selectedProduct = filterProduct(nameProduct) 

  try 
  {
    const requestCookie = await axios.get(`https://www.imprimapormenos.com.br/produtos/${nameProduct}`, { withCredentials: true });
    
    const cookie = String(requestCookie.headers['set-cookie'][0].split(';')[0]).split('/')[1]
    
    res.status(requestCookie.status).json({cookies: cookie, data: selectedProduct.material, etapa: 1})
  }
  catch(err) {
    res.status(err.response.status).json({error: "Página não encontrada - 404!"})
  }
}

export const getSizeProduct = async (req, res) => {
  const {nameProduct, materialId, cookie} = req.params;
  const selectedProduct = filterProduct(nameProduct) 
  
  try 
  {
    const response = await axios({
      url: 'https://www.imprimapormenos.com.br/produtos/selectoption',
      method: 'post',
      withCredentials: true,
      headers: {
        'cookie': cookie
      },
      data: `etapa=1&opcao=${materialId}&order=0&maxOrder=3`
    })
    
    const data = selectedProduct.tamanho.filter(item => response.data.next_opts.indexOf(item.id) > -1)
    
    res.status(response.status).json({data, etapa: 2})
  }
  catch(err) 
  {
    if(err.response){
      res.status(err.response.status).json({error: "Página não encontrada - 404!"})
    }else{
      res.status(400).json({error: "Cookies inválidos Selecione um produto novamente!"})
    }
  }
}

export const getColorProduct = async (req, res) => {
  const {nameProduct, sizeId, cookie} = req.params;
  const selectedProduct = filterProduct(nameProduct) 
  
  try 
  {
    const response = await axios({
      url: 'https://www.imprimapormenos.com.br/produtos/selectoption',
      method: 'post',
      withCredentials: true,
      headers: {
        'cookie': cookie
      },
      data: `etapa=2&opcao=${sizeId}&order=1&maxOrder=3`
    })

    const data = selectedProduct.cores.filter(item => response.data.next_opts.indexOf(item.id) > -1)
    
    res.status(response.status).json({data, etapa: 3})
  }
  catch(err) 
  {
    if(err.response){
      res.status(err.response.status).json({error: "Página não encontrada - 404!"})
    }else{
      res.status(400).json({error: "Cookies inválidos Selecione um produto novamente!"})
    }
  }
}

export const getAcabamentoProduct = async (req, res) => {
  const {nameProduct, colorId, cookie} = req.params;
  const selectedProduct = filterProduct(nameProduct) 
  
  try 
  {
    const response = await axios({
      url: 'https://www.imprimapormenos.com.br/produtos/selectoption',
      method: 'post',
      withCredentials: true,
      headers: {
        'cookie': cookie
      },
      data: `etapa=3&opcao=${colorId}&order=2&maxOrder=3`
    })

    const data = selectedProduct.acabamento.filter(item => response.data.next_opts.indexOf(item.id) > -1)
    
    res.status(response.status).json({data, etapa: 4})
  }
  catch(err) 
  {
    if(err.response){
      res.status(err.response.status).json({error: "Página não encontrada - 404!"})
    }else{
      res.status(400).json({error: "Cookies inválidos Selecione um produto novamente!"})
    }
  }
}

export const getPriceProduct = async (req, res) => {
  const {nameProduct, finishingId, cookie} = req.params;
  const {valor} = filterProduct(nameProduct) 
  
  try 
  {
    const response = await axios({
      url: 'https://www.imprimapormenos.com.br/produtos/selectoption',
      method: 'post',
      withCredentials: true,
      headers: {
        'cookie': cookie
      },
      data: `etapa=4&opcao=${finishingId}&order=3&maxOrder=3`
    })
    const price = response.data

    const vendaComissao = valor.find(item => (
        item.material == price.etapas['1'] 
        && item.tamanho == price.etapas['2'] 
        && item.cores == price.etapas['3'] 
        && item.acabamento == price.etapas['4']
      )
    )
    
    const data = Object.assign(price, vendaComissao)

    // Nessa etapa quando o Cookie está errado ele só retorna um erro PHP, daí verifico 
    // se é um objeto de retorno ou string para validar o erro do cookie
    if(typeof price == 'string')
      price.erro.eror.err;

    res.status(response.status).json({data, etapa: 5})
  }
  catch(err) 
  {
    if(err.response){
      res.status(err.response.status).json({error: "Página não encontrada - 404!"})
    }else{
      res.status(400).json({error: "Cookies inválidos Selecione um produto novamente!"})
    }
  }
}

export const getCombinacoes = async (req, res) => {
  const {nameProduct} = req.params
  console.log(nameProduct)
  const selectedProduct = filterProduct(nameProduct)
  console.log(selectedProduct)
  delete selectedProduct.produto
  delete selectedProduct.nome
  delete selectedProduct.tipo
  delete selectedProduct.image
  delete selectedProduct.valor
  const combinacoes = gerarCombinacoes(selectedProduct);
  // res.json({selectedProduct})
  res.json({valor:combinacoes})
}

//GERA COMBINACOES
function gerarCombinacoes(etapas) {
  const chaves = Object.keys(etapas);
  const valores = chaves.map(chave => etapas[chave]);

  function permutacoes(atual, index) {
    if (index === chaves.length) {
      return [atual];
    }

    const chave = chaves[index];
    const opcoes = valores[index];

    const combinacoes = [];

    for (const opcao of opcoes) {
      const proximasCombinacoes = permutacoes(
        { ...atual, [chave]: opcao.id },
        index + 1
      );
      combinacoes.push(...proximasCombinacoes);
    }

    return combinacoes;
  }

  const combinacoes = permutacoes({}, 0);

  // Adiciona os objetos padrões a cada combinação
  combinacoes.forEach(comb => {
    comb.valorVendaComissaoMin = { venda: 100, comissao: 30 };
    comb.valorVendaComissao = { venda: [80], comissao: [30] };
  });

  return combinacoes;
}