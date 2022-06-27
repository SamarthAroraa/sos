import os

from flask import Flask
import requests
from flask import request

def send_slack_message(text):
    import requests
    import json

    url = "https://slack.com/api/chat.postMessage"

    payload = json.dumps({
    "channel": "C03ESA8MVGS",
    "text": text
    })
    headers = {
    'Authorization': 'Bearer xoxb-3526104312160-3707970622327-hI02YFIK0gl7ae2snN6V8Sbe',
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.route('/slack/sendText')
    def sendText():
        try:
            text = request.args.get('text')
            send_slack_message(text)
            return {"text": text, "status": 200}
        except:
            return {"message": "Internal server error", "status": 500}

    

    return app