from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def main_page():
    return render_template("index.html", question=123)

@app.route("/update", methods=["POST"])
def get_response():
    form_data = request.form
