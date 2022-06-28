import os

from flask import Flask
import requests
from flask import request
# import torchaudio
# from speechbrain.pretrained import EncoderClassifier

import speechbrain as sb


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

@app.route('/serveModel')
def serveModel():
    # return "Test"
    classifier = sb.pretrained.EncoderClassifier.from_hparams(source="speechbrain/urbansound8k_ecapa", savedir="pretrained_models/gurbansound8k_ecapa")
    example_audio_file_path = 'siren-1-decoded.wav'
    out_prob, score, index, text_lab = classifier.classify_file(example_audio_file_path)
    print(text_lab)
    return(str(text_lab[0]))