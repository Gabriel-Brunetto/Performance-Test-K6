import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const options = {
  stages: [
    { duration: '20s', target: 20 },   // 20 usuários virtuais por 2 segundos
    { duration: '20s', target: 100 },   // Aumenta para 50 usuários virtuais por 5 segundos
    { duration: '10s', target: 0 },    // Diminui para 0 usuários virtuais por 2 segundos (encerramento)
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],     // Taxa de falhas de requisições HTTP menor que 1%
    http_req_duration: ['p(95)<200'],   // Duração da requisição no percentil 95 menor que 200ms
  },
};

export default function () {
  const baseUrl = 'http://localhost:3000';
  const usuariosUrl = `${baseUrl}/usuarios`;
  const loginUrl = `${baseUrl}/Login`; // Verifique o caminho exato do endpoint de login
  const prodUrl = `${baseUrl}/Produtos`;

  // Gerando um email aleatório para cada execução
  const randomEmail = `${randomString(10)}@example.com`;

  // Headers comum para as requisições
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Payload para criar um novo usuário
  const payload = {
    nome: randomString(10),  // Nome aleatório
    email: randomEmail,
    password: "t2este123",
    administrador: "true",
  };

  // Convertendo o payload em JSON para ser usado nas requisições POST
  const postPayload = JSON.stringify(payload);

  //Realizando a listagem de usuários
  let listarUsu = http.get(baseUrl)

  // Realizando a requisição POST para criar o usuário
  let response = http.post(usuariosUrl, postPayload, params);

  // Payload para fazer login
  const loginPayload = {
    email: payload.email,
    password: payload.password,
  };

  // Convertendo o payload de login em JSON
  const postLoginPayload = JSON.stringify(loginPayload);

  // Realizando a requisição POST para fazer login
  let loginResponse = http.post(loginUrl, postLoginPayload, params);
  const responseBodyBearer = JSON.parse(loginResponse.body);
  const token = responseBodyBearer.authorization;
  const jwtToken = token.substring(7);
  const headersWithAuth = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
    },
  };

  // Extração do ID do usuário criado para usar na deleção posteriormente
  const responseBody = JSON.parse(response.body);
  const id = responseBody._id;
  const deleteUrl = `${usuariosUrl}/${id}`;

  //Listando Produtos
  let listarprod = http.get(prodUrl)

  //Cadastrando Produto
   const prodPayload = {
    nome: randomString(5),
    preco: 470,
    descricao: "Mouse",
    quantidade: 381
  };

  // Realizando a requisição POST para criar produto
  const postProdPayload = JSON.stringify(prodPayload);
  let prodResponse = http.post(prodUrl, postProdPayload, headersWithAuth);
  
  //Extração ID Produto
  const responseBodyProd = JSON.parse(prodResponse.body);
  const idProd = responseBodyProd._id;
  const deleteProd = `${prodUrl}/${idProd}`;

  //Requisição para deletar produto
  let deleteRespondeProd = http.del(deleteProd, null, headersWithAuth);

  //Verificando exclusão produtos
  let listarprodDelete = http.get(prodUrl)

  // Realizando a requisição DELETE para deletar o usuário
  let deleteResponse = http.del(deleteUrl, null, params);

  //Verificando exclusão usuário
  let listarUsuFinal = http.get(baseUrl)

  // Verificações dos resultados das requisições
  check(listarUsu, { 'Listando Usuários': (r) => r.status === 200});
  check(response, { 'Cadastro De Usuario': (r) => r.status === 201 });
  check(loginResponse, { 'Login realizado com sucesso': (r) => r.status === 200 });
  check(listarprod, { 'Listando Produtos Cadastrados': (r) => r.status === 200});
  check(prodResponse, { 'Cadastro de produto': (r) => r.status === 201});
  check(deleteRespondeProd, { 'Exclusão de produto': (r) => r.status === 200});
  check(listarprodDelete, { 'Listando Produtos Após Exclusão': (r) => r.status === 200});
  check(deleteResponse, { 'Deletando Usuários': (r) => r.status === 200 });
  check(listarUsuFinal, { 'Listando Usuários Após Exclusão': (r) => r.status === 200});

  // Aguarda um curto período antes de iniciar a próxima iteração
  sleep(0.5);
}