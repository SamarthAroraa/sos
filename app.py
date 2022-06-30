from curses.ascii import EM
import speechbrain as sb
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


def base64_to_wav(base64_string, output_wav_file):
    wav_file = open(output_wav_file, "wb")
    decode_string = base64.b64decode(base64_string)
    wav_file.write(decode_string)


class_mapping = [
    "air_conditioner",
    "car_horn",
    "children_playing",
    "dog_bark",
    "drilling",
    "engine_idling",
    "gun_shot",
    "jackhammer",
    "siren",
    "street_music"
]


# def check_emergency(predicted_class, decibel_val):
def check_emergency(predicted_class):
    emergencies = ['gun_shot', 'siren']
    DECIBEL_THRESHOLD = 85
    EMERGENCY = False
    # EMERGENCY = (predicted_class in emergencies) or (decibel_val >= DECIBEL_THRESHOLD)
    EMERGENCY = predicted_class in emergencies
    return EMERGENCY


# if EMERGENCY:
#   # send notification
#   pass

user="U03ESA58B1Q"
user2="U03M8AFGBBM"

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

def send_slack_message_to_samarth():
    import requests
    import json

    url = "https://slack.com/api/chat.postMessage"
    text="Hi, Samarth. Your friend Aaradhya might be in trouble, please check on them at https://goo.gl/maps/KnH2sfDC8rfP4x6R6"
    payload = json.dumps({
        "channel": user2,
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
        send_slack_message_to_samarth()
        return {"text": text, "status": 200}
    except:
        return {"message": "Internal server error", "status": 500}


@app.route('/serveModel', methods=['GET', 'POST'])
def serveModel():
    if(request.method == 'GET'):
        return 'This is a post request test, use post method'
    if(request.method == 'POST'):
        f = request.get_json()
        blob = (f['wav_blob'])
        print(blob[:4])
        example_audio_file_path = 'data/runtime2.wav'

        base64_to_wav(blob, example_audio_file_path)

        # return "Test"
        classifier = sb.pretrained.EncoderClassifier.from_hparams(
            source="speechbrain/urbansound8k_ecapa", savedir="pretrained_models/gurbansound8k_ecapa")
        out_prob, score, index, text_lab = classifier.classify_file(
            example_audio_file_path)
        EMERGENCY = check_emergency(str(text_lab[0]))
        if(EMERGENCY):
            try:
                send_slack_message('There is a siren off nearby. You might want to look around :rotating_light:')
                send_slack_message_to_samarth()
            except:
                pass

        # print(text_lab)
        return({'prediction': str(text_lab[0]), 'EMERGENCY': EMERGENCY})


@app.route('/getBlob', methods=['GET', 'POST'])
def convertFileToBlob():
    file = request.files['wav_file']
    encode_string = base64.b64encode(file.read())
    return encode_string
