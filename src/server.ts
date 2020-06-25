import express from 'express';
import  path from "path";
import routes from './routes';
import cors from 'cors';
import { errors } from 'celebrate';

const app = express();

app.use(cors())
app.use(express.json());

app.use(routes); 

app.use('/uploads', express.static(path.resolve(__dirname,'..','uploads')))

// get: Listagem de dados;
// post: Criação de dados;
// put: Atualizar uma informação existente;
// delete: quando quer se remover dados;

// request params: identificam um recurso , vem na rota /users/:id;
// query params: Parametro opcional, geralmente usado para paginação, vem na propria rota;
// body params: Parametros que vem no corpo no req, usado para criação e utualização;

app.use(errors());

app.listen(3333);

