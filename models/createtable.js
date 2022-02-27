const db = require('./dbpostgres')

const createTablesProdutos = async () => {
  await db.connect()
  await db.query("CREATE TABLE produtos(idproduto INT(5) AUTO_INCREMENT, nomeproduto VARCHAR(255), descicaoproduto TEXT, categoriaproduto VARCHAR(100), metroquadrado BOOLEAN NOT NULL DEFAULT false, PRIMARY KEY(idproduto) ) ENGINE=INNODB")
  const result = await db.query("DESCRIBE produtos")
  console.log(result)
  await db.end()
}

const createTablesValores = async () => {
  await db.connect()
  await db.query('CREATE TABLE valores(,idvalor INT(6) AUTO_INCREMENT ,idproduto INT(5) ,quantidade INT(6) ,preco DECIMAL(6,2) ,custo DECIMAL(6,2) ,PRIMARY KEY(idvalor) ,FOREIGN KEY(idproduto REFERENCES produtos (idproduto)) ) ENGINE=INNODB')
  await db.end()
}

createTablesProdutos()