# spotify-search-ui app
### Build and run docker container

Clone repo `git clone https://github.com/maciejd/restful-api-python-flask.git`

Chande directory `cd spotify-search-ui`

Build image `docker build -t spotify-search-ui:dev .` 
  
Run container in detached mode and publish port 3001 `docker run -v ${PWD}:/app -v /app/node_modules -p 3001:3000 --rm spotify-search-ui:dev`
  
App should be accessible on port 3001 `curl -i http://localhost:3001`