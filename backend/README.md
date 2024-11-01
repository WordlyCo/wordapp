# Word App Backend

Instructions
1. Start a virtual envrionment for python
`python3 -m venv .env`
2. Activate it (look up how to do this for your OS)
On macOS or Linux, you can do (in the terminal)
`source .env/bin/activate`
3. Install the required libraries
`pip install -r requirements.txt`
4. Run the app
`uvicorn app.main:app --reload`

And now you have a backend app running with live reload. 
If you make any changes to the code and save, it will reload automagically.

### Resources
Fully fledged fastAPI template with postgres you can learn from - https://github.com/fastapi/full-stack-fastapi-template