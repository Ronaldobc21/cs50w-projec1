import os

from flask import Flask, session, render_template, request, url_for
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker


app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
 
# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


@app.route('/') #obtenemos un objeto llamado app
def index():
    return render_template('index.html')


@app.route('/login',methods = ['POST', 'GET'])
def login():
    return render_template('login.html')


@app.route('/register',methods = ['POST', 'GET'])
def register():
    return render_template('register.html')



if __name__ == '__main__': #con este archivo que hace el metodo de ejecucion
    app.run(debug=True)