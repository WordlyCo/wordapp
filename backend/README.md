# Word App Backend

Instructions
1. Install Docker and Docker Compose.

These are typically installed by default if you install [Docker Desktop](https://www.docker.com/products/docker-desktop/). 
<br>
Look up how to install it for your OS.

2. Start the backend by this command

```docker-compose up --build```

The above command will build and run two separate docker services
- postgres database 
- python backend code

After running the command, you should be able to see the API live at `http://localhost:8000`

Stop the project by CTRL+C or 

```docker-compose down```


### Resources
Fully fledged fastAPI template with postgres you can learn from - https://github.com/fastapi/full-stack-fastapi-template