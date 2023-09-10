""" Do YOU think you are real? """

from json import dumps
from os import environ
from pathlib import Path
from re import compile

from flask import Flask, request

app = Flask(__name__)

CONTENT_PATH=Path(environ["TIMECHECK_CONTENT_PATH"])
FORCE_OPEN = environ.get("FORCE_OPEN", False)
TIME_RE = compile("\d{1,2}:\d{1,2}:\d{1,2}\.?\d*")


class OpeningHoursChecker:
    def __init__(self, open_time: int, close_time: int) -> None:
        self.open_time = open_time
        self.close_time = close_time

    def is_open(self, t_check):
        is_open_day = t_check >= self.open_time and t_check < self.close_time
        # Open hours might straddle midnight
        is_open_night = self.close_time < self.open_time and (
            t_check < self.close_time or t_check >= self.open_time
        )
        return is_open_day or is_open_night


checker = OpeningHoursChecker(8, 16)

# Read a file in TIMECHECK_CONTENT_PATH
def _read_private(name):
    path = CONTENT_PATH.joinpath(name).absolute()
    with open(path, encoding="utf-8") as file:
        return "".join(file.readlines())


# Create the HTTP response
def _json_response(result):
    return app.response_class(
        response=dumps(result), status=200, mimetype="application/json"
    )


@app.route("/", methods=["POST"])
def get_content():
    """Get main page content, depending on time of day"""
    time_match = TIME_RE.search(request.get_json()["clientTime"])
    hour = int(time_match.group(0).split(":")[0])

    if checker.is_open(hour) or FORCE_OPEN:
        result = {
            "cssFile": "open",
            "content": _read_private("open-body.html"),
            "title": "OPEN",
        }
    else:
        result = {
            "cssFile": "closed",
            "content": _read_private("closed-body.html"),
            "title": "closed",
        }
    return _json_response(result)
