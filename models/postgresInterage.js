const db = require('./dbpostgres')

db.connect()

const converterEmPonto = (a) => {
  a = a.toString().split(",")
  b = a[1] != undefined ? a[1] : '00';
  return `${a[0]}.${b}`
}

const converterEmVirgula = (a) => {
  a = a.toString().split(".")
  b = a[1] != undefined ? a[1] : '00';
  return `${a[0]},${b}`
}

const insertProduct = async (data) => {
  m2 = data.metroquadrado == 'true' ? true : false;
  const sql = `INSERT INTO public.produtos (nomeproduto, descicaoproduto, categoriaproduto, metroquadrado) VALUES ('${data.name}','${data.description}','${data.category}', ${data.metroquadrado})`;
  queryProducts = await db.query(sql)

  sqlLastId = `SELECT idproduto FROM public.produtos ORDER BY idproduto DESC`;
  lastId = await db.query(sqlLastId)

  console.log("-------")
  console.log(lastId.rows[0].idproduto)

  data.price = converterEmPonto(data.price)
  data.cost = converterEmPonto(data.cost)

  const sqlvalues = `INSERT INTO public.valores (idproduto, quantidade, preco, custo) VALUES ('${lastId.rows[0].idproduto}','${data.amount}','${data.price}','${data.cost}')`;
  await db.query(sqlvalues)
  .then(res =>{ console.log(res)})
  .catch(err =>{ console.log(err)})
}

const deleteProduct = async (id) => {

  const sqlValues = `DELETE FROM public.valores WHERE idproduto = ${id}`;
  const deleteValores = await db.query(sqlValues)

  const sqlProducts = `DELETE FROM public.produtos WHERE idproduto = ${id}`;
  const deleteVal = await db.query(sqlProducts)
}

const deleteValues = async (id) => {
  const sqlValues = `DELETE FROM public.valores WHERE idvalor = ${id}`;

  try {
    const deleteValores = await db.query(sqlValues)
  } finally {
  }
}

const showProducts = async () => {


  const allProducts = `SELECT * FROM public.produtos ORDER BY idproduto DESC`;
  let produtos = await db.query(allProducts)

  try {
    const sql = `SELECT v.* FROM public.produtos p INNER JOIN public.VALORES v ON p.idproduto = v.idproduto`;
    const values = await db.query(sql)

    if(values.rows.length > 0){
      values.rows.map(item => {
        item.preco = converterEmVirgula(item.preco)
        item.custo = converterEmVirgula(item.custo)
      })


      valoresProdutos = produtos.rows.map(item => ({...item, valores: values.rows.filter(val => val.idproduto == item.idproduto) } ) )

      return valoresProdutos
    }
    
    return false
  } catch(err){
    console.log(err)
  }finally {
    // db.end();
  }
}

const insertValues = async ({idproduct, valor, quantidade, custo} = data) => {

  valor = valor.split(",")
  custo = custo.split(",")

  valor = `${valor[0]}.${valor[1]}`
  custo = `${custo[0]}.${custo[1]}`

  const sql = `INSERT INTO public.valores (idproduto, quantidade, preco, custo) VALUES (${idproduct},${quantidade},${valor},${custo});`;
  const result = await db.query(sql)
}

const updateValues = async ({idvalue, valor, quantidade, custo} = data) => {
  valor = converterEmPonto(valor)
  custo = converterEmPonto(custo)

  const sql = `UPDATE public.valores set quantidade=${quantidade}, preco=${valor}, custo=${custo} WHERE idvalor=${idvalue}`;
  const result = await db.query(sql)
}

// idproduct
// valor
// quantidade
// custo

module.exports = {
insertProduct: insertProduct,
insertValues: insertValues,
updateValues: updateValues,
deleteProduct: deleteProduct, 
deleteValues: deleteValues, 
showProducts: showProducts
}