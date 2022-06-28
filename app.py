import os

from flask import Flask
import requests
from flask import request
import base64
def base64_to_wav(base64_string, output_wav_file):
  wav_file = open(output_wav_file, "wb")
  decode_string = base64.b64decode(base64_string)
  wav_file.write(decode_string)

# import torchaudio
# from speechbrain.pretrained import EncoderClassifier

import speechbrain as sb

def base64_to_wav(base64_string, output_wav_file):
  wav_file = open(output_wav_file, "wb")
  decode_string = base64.b64decode(base64_string)
  wav_file.write(decode_string)


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

@app.route('/serveModel', methods=['GET', 'POST'])
def serveModel():
    if(request.method == 'GET'):
        return 'This is a post request test, use post method'
    if(request.method == 'POST'):
        file = request.files['wav_file']
        file.save('data/runtime.wav')
        
        # return "Test"
        classifier = sb.pretrained.EncoderClassifier.from_hparams(source="speechbrain/urbansound8k_ecapa", savedir="pretrained_models/gurbansound8k_ecapa")
        example_audio_file_path = 'data/runtime.wav'
        out_prob, score, index, text_lab = classifier.classify_file(example_audio_file_path)
        print(text_lab)
        return(str(text_lab[0]))

@app.route('/getBlob', methods=['GET', 'POST'])
def convertFileToBlob():
    file = request.files['wav_file']
    encode_string = base64.b64encode(file.read())
    return encode_string