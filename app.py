import os

from flask import Flask
import requests
from flask import request
import torchaudio

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

app = Flask(__name__)



@app.route('/')
def hello():
    return 'Welcome to SOS backend!'

@app.route('/slack/sendText')
def sendText():
    try:
        text = request.args.get('text')
        send_slack_message(text)
        return {"text": text, "status": 200}
    except:
        return {"message": "Internal server error", "status": 500}
