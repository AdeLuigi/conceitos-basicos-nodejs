# Conceitos básicos de Node.js

**Um crud sem banco de dados conectado que mostra conceitos essenciais sobre Node.js**

## Rodando o projeto

```
$ git clone https://github.com/AdeLuigi/conceitos-basicos-nodejs.git
$ cd conceitos-basicos-nodejs
$ yarn
```

**Neste momento o servidor já deve estar pronto para rodar**

```
$ yarn dev
```

## O que você verá implementado?

* Métodos como POST, GET, PUT, DELETE
* Diferenciação de rotas
* Validação de id
* Retorno de status da requisição (200. 404, 204)
* Parâmetros de rotas (route params)
* Request body com JSON

---

## 1 - Métodos
O método POST é utilizado de duas formas na aplicação. A primeira consiste em uma postagem de um repositório, veja o exemplo abaixo:

``` javascript
const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const app = express();

repositories = [];

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository)

});
```
A variável express representa o import da função express do nosso framework Express.
```javascript
const express = require("express");
```

Logo abaixo nós importamos duas funções da uuidv4, uma lib que nos auxilia a criar Ids únicos e validar eles.
A função uuid gera um id único pra gente, e a função isUuid verifica se aquele id é válido.
```javascript
const { uuid, isUuid } = require("uuidv4");
```
A variável repositories funcionará como um "banco de dados", utilizaremos ela para armazenar todos os nossos repositórios
````javascript
repositories = [];
````
A função post() representa o método HTTP POST, como **primeiro** parâmetro ela recebe a rota, então toda a vez que acessarem **/repositories** com um método POST, essa função será chamada. Como segundo parâmetro ela recebe uma outra função que será encarregada de pegar o corpo desse request( JSON enviado ) e adicionar ele no nosso "banco de dados", gerando um id único para ele.
``` javascript
app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository)

});
```
Depois de adicionar o dado no "banco", nós iremos mostrar esses dados com a rota **app.get("/repositories"**), essa rota tem a simples função de retornar um json com todos os nossos repositórios toda a vez que ela for acionada 
````javascript
app.get("/repositories", (request, response) => {

  return response.json(repositories);

});
````
Logo em seguida nós iremos implementar a parte de edição dos nossos dados, a rota de edição é um pouco diferente das anteriores, para acessar ela nós também precisamos passar um ***parametro de rota*** que é o Id do repositório, algo assim **/repositories/123456**.
````javascript
app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if(!isUuid(id)){
    return response.status(400).json({message: "Mano, deu ruim nesse id"});
  }
  
  repositoryIndex = repositories.findIndex((repository) =>  repository.id === id )

  if(repositoryIndex < 0){
    return response.status(404).json({message:"Esse id é válido, mas não tá no array"})
  }

  repositoryUpdate = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repositoryUpdate;

  return response.status(200).json(repositoryUpdate);

});
````
A primeira linha é encarregada de pegar o parâmetro de roda id passado pelo request, note que estou usando desestruturação para não precisar percorrer todos os parâmetros do request.
````javascript
const { id } = request.params;
````
Logo abaixo eu continuo usando desestruturação para transformar todo o json passado pelo corpo da requisição em 3 variáveis **(title, url e techs)**
````javascript
const { title, url, techs } = request.body;
````
Então eu faço uso da função isUuid para verificar se o id passado como parâmetro de rota é valido, caso não seja eu retorno um response com o status 400 de erro e uma mensagem explicando o erro
````javascript
if(!isUuid(id)){
  return response.status(400).json({message: "Mano, deu ruim nesse id"});
}
````
Passando pela primeira validação eu verifico a posição daquele id no array de repositórios, caso o id seja válido e não esteja dentro do array eu retorno um response com o status 404 de erro e uma mensagem JSON explicando o erro
````javascript
repositoryIndex = repositories.findIndex((repository) =>  repository.id === id )

if(repositoryIndex < 0){
  return response.status(404).json({message:"Esse id é válido, mas não tá no array"})
}
````
Caso tenha passado por essas duas validações eu atribuo os dados do corpo da requisição **(title, url, techs)** para a variável repositoryUpdate, mantendo o id original e o número de likes e só alterando **title**, **url** e **techs** do repositório.
````javascript
repositoryUpdate = {
  id,
  title,
  url,
  techs,
  likes: repositories[repositoryIndex].likes
}
```` 
Depois eu procuro no array repositories o index correspondente aquele repositório e atualizo ele. Logo em seguida eu retorno o response com status 200 que corresponde a um OK e também retorno o json correspondente ao novo valor daquele repositório
```javascript
repositories[repositoryIndex] = repositoryUpdate;

return response.status(200).json(repositoryUpdate);
```
Logo em seguida nós iremos implementar a parte de exclusão dos nossos dados, a rota de exclusão é um pouco parecida com a de edição, pra acessar ela nós também precisamos passar um ***parametro de rota*** que é o Id do repositório, algo assim **/repositories/123456**.
````javascript
app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({message: "Mano, deu ruim nesse id"});
  }
  
  repositoryIndex = repositories.findIndex((repository) =>  repository.id === id )

  if(repositoryIndex < 0){
    return response.status(404).json({message:"Esse id é válido, mas não tá no array"});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send()

});
````
A primeira linha é encarregada de pegar o parâmetro de roda id passado pelo request, note que estou pegando o corpo da requisição, pois na roda de delete nós só precisamos do id para excluir o dado.
````javascript
const { id } = request.params;
````
Então eu faço uso da função isUuid para verificar se o id passado como parâmetro de rota é valido, caso não seja eu retorno um response com o status 400 de erro e uma mensagem explicando o erro
````javascript
if(!isUuid(id)){
  return response.status(400).json({message: "Mano, deu ruim nesse id"});
}
````
Passando pela primeira validação eu verifico a posição daquele id no array de repositórios, caso o id seja válido e não esteja dentro do array eu retorno um response com o status 404 de erro e uma mensagem JSON explicando o erro
````javascript
repositoryIndex = repositories.findIndex((repository) =>  repository.id === id )

if(repositoryIndex < 0){
  return response.status(404).json({message:"Esse id é válido, mas não tá no array"})
}
````
Logo em seguida eu uso a função splice para deletar o elemento do array correspondente ao id passado como parâmetro de rota e retorno um status 204 vazio.
````javascript
repositories.splice(repositoryIndex, 1);

return response.status(204).send()
````
Por ultimo, mas não menos importante vamos implementar a rota de likes, ela é um pouco diferente das outras pois tem duas rotas /**repositories**/:id/**like**
````javascript
app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({message: "Mano, deu ruim nesse id"});
  }
  
  repositoryIndex = repositories.findIndex((repository) =>  repository.id === id )

  if(repositoryIndex < 0){
    return response.status(404).json({message:"Esse id é válido, mas não tá no array"})
  }

  repositories[repositoryIndex].likes += 1;

  return response.status(200).json(repositories[repositoryIndex]);

});
````
A primeira linha é encarregada de pegar o parâmetro de roda id passado pelo request, note que estou pegando o corpo da requisição, pois na roda de like nós só precisamos do id para adicionar o like no repositório.
````javascript
const { id } = request.params;
````
Então eu faço uso da função isUuid para verificar se o id passado como parâmetro de rota é valido, caso não seja eu retorno um response com o status 400 de erro e uma mensagem explicando o erro
````javascript
if(!isUuid(id)){
  return response.status(400).json({message: "Mano, deu ruim nesse id"});
}
````
Passando pela primeira validação eu verifico a posição daquele id no array de repositórios, caso o id seja válido e não esteja dentro do array eu retorno um response com o status 404 de erro e uma mensagem JSON explicando o erro
````javascript
repositoryIndex = repositories.findIndex((repository) =>  repository.id === id )

if(repositoryIndex < 0){
  return response.status(404).json({message:"Esse id é válido, mas não tá no array"})
}
````
Agora eu uso a **repositories[repositoryIndex].likes** para acessar o campo like daquele repositório e aumentar o número de likes em +1 toda a vez que acessarmos essa rota
````javascript
repositories[repositoryIndex].likes += 1;

return response.status(200).json(repositories[repositoryIndex]);
````