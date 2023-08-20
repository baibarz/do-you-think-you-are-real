""" Do YOU think you are real? """

import datetime
import json
from os import environ
from pathlib import Path

from flask import Flask, request

app = Flask(__name__)

def _is_open(t_open, t_close, t_check):
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
    path = Path(".").joinpath(name).absolute()
    with open(path) as file:
        return file.readlines()

@app.route("/alive")
def get_alive():
    return "Yes"

@app.route("/content", methods=["POST"])
def get_content():
    """ Get main page content, depending on time of day"""
    request_data = request.get_json()["clientTime"]
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
