from flask import Flask, render_template, request
import datetime

app = Flask(__name__)

@app.route("/")
def main_page(): 
    current_time = datetime.datetime.now().time()  
    open_time = datetime.time(hour=8)
    closed_time =datetime.time(hour=16)
    if current_time >= open_time and current_time <= closed_time:
        return render_template("index.html", question="do you think you are real")
    else:
        return render_template("closed.html")
        
@app.route("/update", methods=["POST"])
def get_response():
    form_data = request.form

