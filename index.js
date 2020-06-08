const express = require("express");
const server = express();

server.use(express.json());

// Query params = ?teste=1
// req.query.nome

// Route params = /users/1
// Route params = /users/:id
// req.param.id
// ou
// { id } = req.param

// Request body = {"nome": "Eloy", "email": "eloy@sgeinformatica.com.br"}

const users = ["Eloy", "Gontijo", "Martins"];

// middleware global
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next(); // usando apenas next(), o fluxo continua nas linhas abaixo
  console.timeEnd("Request");
});

// middleware local
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is requerid" });
  }
  return next(); // usando return next(), a funcao para aqui.
}

function checkUserIndex(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User index out of range" });
  }

  // O conteúdo de req pode ser modificado e
  // utilizados nas rotas que usam a middleware
  req.user = user;
  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserIndex, (req, res) => {
  //const { index } = req.params;
  return res.json(req.user); // user foi criado na middlerware
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.put("/users/:index", checkUserExists, checkUserIndex, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users);
});

server.delete("/users/:index", checkUserIndex, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.json(users);
});

server.listen(3000);