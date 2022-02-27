const bodyParser = require('body-parser');
const express = require('express')
const axios = require('axios')
const app = express();
// const path = require('path');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


const {insertProduct, insertValues, updateValues, showProducts, deleteProduct, deleteValues} = require('./models/postgresInterage')

// Engine Pug
app.set('views', "./views")
app.set('view engine', 'pug')

//Configurando arquivos
app.use(express.static('./public'))


routeHome = require('./routes/home')
app.use('/', routeHome)

app.get('/config', async (req, resp) => {
  
  const produtos = await showProducts()
  console.log(produtos)
  resp.render('adminConfig', {produto: produtos})
  
})

app.get('/inserir', (req, resp) => {
  let data = req.query
  insertProduct(data)
  resp.redirect('/config')
})

app.get('/delete/:id', (req, resp) => {
  deleteProduct(req.params.id)
  resp.redirect('/config')
})

app.get('/deletevalues/:id', (req, resp) => {
  deleteValues(req.params.id)
  resp.redirect('/config')
})

app.post('/insertvalues', (req, resp) => {
  insertValues(req.body)
  resp.redirect('/config')
})

app.post('/updatevalues', (req, resp) => {
  updateValues(req.body)
  resp.redirect('/config')
})

// [------ Pegar informações de preço Bureau ------]


let produtos = [
  {
    produto: 'Cartao-de-Visita',
    priceServer: 'imprimapormenos',
    material: [
      { nome: 'Couché 300g', id: '1' },
      { nome: 'Couché 250g', id: '57' },
    ],
    tamanho: [{ nome: '9.1x5.1cm, Arte Final (8.8X4.8cm)', id: '3' }],
    cores: [
      { nome: 'Só Frente', id: '6' },
      { nome: 'Frente e Verso', id: '8' },
    ],
    acabamento: [
      { nome: 'Verniz Total', id: '11', materialId: ['57', '1'] },
      { nome: 'Laminação Fosca Frente e Verso', id: '10', materialId: ['1'] },
      { nome: 'Laminação Fosca FV + Verniz Local', id: '9', materialId: ['1'] },
      {
        nome: 'Laminação Fosca FV + Cantos Arred',
        id: '44',
        materialId: ['1'],
      },
      {
        nome: 'Lam Fsc FV+Verniz Loc+Cantos Arred', id: '43', materialId: ['1'],
      },
      {
        nome: 'Verniz Total  Frente + Cantos Arred', id: '135', materialId: ['1'],
      },
    ],
  },
  {
    produto: 'Banner-Faixa-Fachada',
    priceServer: 'devtec',
    prazo: 2,
    material: [
      { nome: 'Banner 380g Brilho', id: '1', price: '29', priceMin: '15', prazoEntrega: '2' },
      { nome: 'Banner 380g UV', id: '2', price: '39', priceMin: '15', prazoEntrega: '2' },
      { nome: 'Faixa 380g Brilho', id: '3', price: '29', priceMin: '15', prazoEntrega: '2' },
      { nome: 'Faixa 380g UV', id: '4', price: '39', priceMin: '15', prazoEntrega: '2' },
      { nome: 'Fachada 380g Brilho', id: '5', price: '29', priceMin: '15', prazoEntrega: '2' },
      { nome: 'Fachada 380g UV', id: '6', price: '39', priceMin: '15', prazoEntrega: '2' },
    ],
    tamanho: [{ nome: 'M²', id: '1' }],
    cores: [{ nome: 'Só Frente', id: '1' }],
    acabamento: [
      {
        nome: 'Madeira e Cordinha', id: '1', materialId: ['1', '3', '4', '5', '6'],
      },
      { nome: 'Ilhós', id: '2', materialId: ['1', '2', '3', '4', '5', '6'] },
      {
        nome: 'Sem Acabamento', id: '3', materialId: ['1', '2', '3', '4', '5', '6'],
      },
    ],
  },
];

const select = {
  product: null,
  opcao1: null,
  opcao2: null,
  opcao3: null,
  opcao4: null,
  price: null,
  deliveryTime: null,
  quantity: 1,
  unity: 0
};

//Pega a URL e seleciona só o JSON que será usado o outro ele exclui
const SelectProduct = nameProduct => select.product = produtos.filter(item => item.produto == nameProduct)[0];

//Selecionando Opção 1 Material pelo ID
const opcao1 = idSelected => select.opcao1 = select.product.material.filter(m => m.id == idSelected)[0];

// //Selecionando Opção 2 Tamanho pelo ID
const opcao2 = tamanho => select.opcao2 = select.product.priceServer == 'devtec' ? tamanho : select.product.tamanho.filter(m => m.id == tamanho)[0]

// //Selecionando Opção 3 Cores pelo ID
const opcao3 = idSelected => select.opcao3 = select.product.cores.filter(m => m.id == idSelected)[0]

// //Selecionando Opção 4 Acabamento pelo ID
const opcao4 = idSelected => select.opcao4 = select.product.acabamento.filter(m => m.id == idSelected)[0]
.materialId.filter(id => id == select.opcao1.id).length !== 0 ? 
select.product.acabamento.filter(m => m.id == idSelected)[0] : false;

const quantity = qtd => {
  select.quantity = qtd;
  select.unity = qtd;
}

//TODO Ajustar o prazo
const deliveryTime = timeD => select.deliveryTime = timeD;

const priceCalculatorM2 = (data) => select.price = (((data[0] * data[1]) * select.opcao1.price ) / 10000) * select.quantity;

const priceCalculator = (data,qtd) => {
  console.log(data)
  console.log(data.valor < data.preco_min)
  
  if(qtd == 1 && data.valor < data.preco_min){
    select.price = data.preco_min
    select.unity = data.qtd
  }else{
    select.unity = data.qtd * qtd
    let i = data.quant.indexOf(select.unity.toString()) >= 0 ? data.quant.indexOf(select.unity.toString()) : data.quant.length -1;
    deliveryTime(data.prazo[i])
    select.price = data.valor[i] * qtd
  }

  // data.precomin // TODO PAREI AQUI
  // select.price = (((data[0] * data[1]) * select.opcao1.price ) / 10000) * select.quantity;
}

//Tem que fazer 5 requisições, 1º Cookie, 2º Etapa 1, 3º Etapa 2, 4º Etapa 3, 5º Etapa 4 (final)
console.log('com requisição');

const sleep = (ms) => new Promise((resolve)=>setTimeout(resolve, ms))

const requestValues = async (opcao1, opcao2, opcao3, opcao4) => {
  
  const requestCookie = await axios.get('https://www.imprimapormenos.com.br/produtos/Cartao-de-Visita', { withCredentials: true });
  
  const cookie = String(requestCookie.headers['set-cookie'][0].split(';')[0])
  
  console.log(cookie)
  console.log('--------------')
  
  const etapa1 = await axios({
    url: 'https://www.imprimapormenos.com.br/produtos/selectoption',
    method: 'post',
    withCredentials: true,
    headers: {
      'cookie': cookie
    },
    data: `etapa=1&opcao=${opcao1}&order=0&maxOrder=3`
  })
  
  const etapa2 = await axios({
    url: 'https://www.imprimapormenos.com.br/produtos/selectoption',
    method: 'post',
    withCredentials: true,
    headers: {
      'cookie': cookie
    },
    data: `etapa=2&opcao=${opcao2}&order=1&maxOrder=3`
  })
  
  const etapa3 = await axios({
    url: 'https://www.imprimapormenos.com.br/produtos/selectoption',
    method: 'post',
    withCredentials: true,
    headers: {
      'cookie': cookie
    },
    data: `etapa=3&opcao=${opcao3}&order=2&maxOrder=3`
  })
  
  const etapa4 = await axios({
    url: 'https://www.imprimapormenos.com.br/produtos/selectoption',
    method: 'post',
    withCredentials: true,
    headers: {
      'cookie': cookie
    },
    data: `etapa=4&opcao=${opcao4}&order=3&maxOrder=3`
  })
  
  return etapa4.data
}

// SOLICITANDO PEDIDO

SelectProduct('Cartao-de-Visita')
// Limpando o array de produtos para não pesar na memória

produtos = [];

opcao1(57)
opcao2(3)
opcao3(6)
opcao4(11)
quantity(3)

const init = async () => {

  if(select.opcao1 && select.opcao2 && select.opcao3 && select.opcao4){

    if(select.product.priceServer == 'devtec'){
      priceCalculatorM2(select.opcao2)
      deliveryTime(select.product.prazo)
    } else{
      const data = await requestValues(select.opcao1.id, select.opcao2.id, select.opcao3.id, select.opcao4.id)
      priceCalculator(data, select.quantity)
    }
  
  }else{
    console.log("Opção invalida, verifique se está tudo correto e tente novamente")
  }
  
  console.log(select)
}

init()

// [------ FIM ------]


const PORT = process.env.PORT || 1993
app.listen(PORT, console.log("Aplicação Iniciada"))