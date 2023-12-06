import express from 'express'
import routes from './routes/index.js'

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));

routes(app)

const PORT = process.env.PORT || 8080
app.listen(PORT, console.log(`Aplicação Rodando na porta ${PORT}`))