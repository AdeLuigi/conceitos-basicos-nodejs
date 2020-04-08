const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.json(repositories);

});

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

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if(!isUuid(id)){
    return response.status(400).json({message: "Mano, deu ruim nesse id"});
  }
  
  repositoryIndex = repositories.findIndex((repository) =>  repository.id === id )

  if(repositoryIndex < 0){
    return response.status(404).json({message:"Esse id é valido mas não tá no array"})
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

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({message: "Mano, deu ruim nesse id"});
  }
  
  repositoryIndex = repositories.findIndex((repository) =>  repository.id === id )

  if(repositoryIndex < 0){
    return response.status(404).json({message:"Esse id é valido mas não tá no array"});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({message: "Mano, deu ruim nesse id"});
  }
  
  repositoryIndex = repositories.findIndex((repository) =>  repository.id === id )

  if(repositoryIndex < 0){
    return response.status(404).json({message:"Esse id é valido mas não tá no array"})
  }

  repositories[repositoryIndex].likes += 1;

  return response.status(200).json(repositories[repositoryIndex]);

});

module.exports = app;
