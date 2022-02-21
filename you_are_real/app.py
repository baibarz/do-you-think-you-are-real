""" Do YOU think you are real? """

from os import environ
import datetime
import json

from flask import Flask, render_template, request

from you_are_real.data import Database

app = Flask(__name__)

@app.route("/")
def main_page():
    """ Get index.html """
    # TODO: index.html could be static
    return render_template("index.html")

db = Database(environ["DATABASE_URL"])
force_state = environ.get("FORCE_STATE", None)

def _is_open(t_open, t_close, t_check):
    if force_state == "open":
        return True
    if force_state == "closed":
        return False
    is_open_day = (t_check >= t_open and t_check < t_close)
    # Open hours might straddle midnight
    is_open_night = (t_close < t_open and (t_check < t_close or t_check >= t_open))
    return is_open_day or is_open_night

def _json_response(result):
    return app.response_class(
        response=json.dumps(result),
        status=200,
        mimetype='application/json'
    )

@app.route("/content", methods=["POST"])
def get_content():
    """ Get main page content, depending on time of day"""
    request_data = request.get_json()
    hour = datetime.timedelta(minutes=int(request_data["minutes"]))
    open_time = datetime.timedelta(hours=8)
    closed_time = datetime.timedelta(hours=16)
    if _is_open(open_time, closed_time, hour):
        result = {
            "css_file": "static/open.css",
            "body" : render_template("open.html"),
            "title": "first prise"
        }
    else:
        result = {
            "css_file": "static/closed.css",
            "body" : render_template("closed.html"),
            "title": "closed"
        }
    return _json_response(result)


@app.route("/update", methods=["POST"])
def record_answer():
    """ Record answer and return next question """
    answer = request.json["answer"]
    user_id = request.json["user_id"]
    question_id = request.json["question_id"]
  
    # Next question
    if question_id == 0:
        # Set user
        user_id = db.get_user_id(answer)
        if not user_id:
            user_id = db.create_user(answer)
        # "Do you think you are real?"
        question = db.get_question(1)
        question_id = 1
    else:
        db.add_answer(user_id, question_id, answer)
        question_id, question = db.get_random_question(user_id)
    return _json_response(
        {
            "question_id": question_id,
            "question": question,
            "user_id": user_id
        }
    )
