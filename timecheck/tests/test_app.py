from datetime import datetime

from pytest import fixture

from timecheck.app import app

app.config["TESTING"] = True

@fixture
def client():
    return app.test_client()

def test_app_runs(client):
    client.get("/", json={"clientTime": str(datetime.now())})
