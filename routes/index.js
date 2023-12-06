import produtoServer from './produtoServer.js';
import produtoLocal from './produtoLocal.js';
import front from './front.js';

export default app => {
  
  app.use(
    produtoServer,
    produtoLocal,
    front,
  )
}