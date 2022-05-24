""" Do YOU think you are real? """

import datetime
from importlib.resources import read_text
import json
from os import environ
from pathlib import Path

from flask import Flask, redirect, request, url_for

from you_are_real.data import Database
from you_are_real import private

app = Flask(__name__)

@app.route("/")
def main_page():
    """ Get index.html """
    return redirect(url_for("static", filename="index.html"))

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

def _read_private(name):
    path = Path(".").joinpath("you_are_real", "private", name).absolute()
    with open(path) as file:
        return file.readlines()

@app.route("/content", methods=["POST"])
def get_content():
    """ Get main page content, depending on time of day"""
    request_data = request.get_json()
    hour = datetime.timedelta(minutes=int(request_data["minutes"]))
    open_time = datetime.timedelta(hours=8)
    closed_time = datetime.timedelta(hours=16)
    p = Path(".")
    p.joinpath("static")
    if _is_open(open_time, closed_time, hour):
        result = {
            "css_file": "open.css",
            "body" : _read_private("open.html"),
            "title": "first prise"
        }
    else:
        result = {
            "css_file": "closed.css",
            "body" : _read_private("closed.html"),
            "title": "closed"
        }
    return _json_response(result)


def _get_next_question(user_id):
    if not db.has_answer(user_id, 1):
        return (1, db.get_question(1))
    return db.get_random_question(user_id)


@app.route("/update", methods=["POST"])
def record_answer():
    """ Record answer and return next question """
    answer = request.json["answer"]
    user_id = request.json["user_id"]
    question_id = request.json["question_id"]
  
    # Next question
    if question_id == 0:
        # "Who are you?"
        # Set user
        user_id = db.get_user_id(answer)
        if not user_id:
            user_id = db.create_user(answer)
    else:
        db.add_answer(user_id, question_id, answer)
    
    question_id, question = _get_next_question(user_id)
    return _json_response(
        {
            "question_id": question_id,
            "question": question,
            "user_id": user_id
        }
    )