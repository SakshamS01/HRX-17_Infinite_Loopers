from flask import Flask, Response, jsonify, session, render_template, request, redirect, url_for
import pyrebase
import json
import cv2
from keras.models import model_from_json
import uuid
import numpy as np
import os
import subprocess
import threading
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize Firebase Admin SDK (for server-side privileged operations)
from firebase_admin import credentials, initialize_app

cred_dict = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
}

cred = credentials.Certificate(cred_dict)
initialize_app(cred)

# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'secret'

# Pyrebase client-side configuration (from .env)
config = {
    'apiKey': os.environ.get("FIREBASE_API_KEY"),
    'authDomain': os.environ.get("FIREBASE_AUTH_DOMAIN"),
    'projectId': os.environ.get("FIREBASE_PROJECT_ID"),
    'storageBucket': os.environ.get("FIREBASE_STORAGE_BUCKET"),
    'messagingSenderId': os.environ.get("FIREBASE_MESSAGING_SENDER_ID"),
    'appId': os.environ.get("FIREBASE_APP_ID"),
    'databaseURL': os.environ.get("FIREBASE_DATABASE_URL"),
}

# Initialize Pyrebase
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

# --------------------------------------------------
# routes
# --------------------------------------------------

name = ''

@app.route('/', methods=['GET'])
def index():
    if 'user' in session:
        logged_in = True
        user_email = session['user']
    else:
        logged_in = False
        user_email = None
    return render_template('index.html', logged_in=logged_in, user_email=user_email)


@app.route('/signup', methods=['POST', 'GET'])
def signup():
    global name
    if 'user' in session:
        return redirect('/')
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        db.child('users').child(name).set(email)

        try:
            user = auth.create_user_with_email_and_password(email, password)
            session['user'] = email
            return redirect('/')
        except:
            return 'Failed to signup'
    return render_template('signup.html')


@app.route('/login', methods=['POST', 'GET'])
def login():
    global name
    if 'user' in session:
        return redirect('/')
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        try:
            user = auth.sign_in_with_email_and_password(email, password)
            session['user'] = email
            check = db.child("users").get()
            di = dict(check.val())
            name = get_name_by_email(email, di)
            return redirect('/')
        except:
            return 'Failed to login'
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('user')
    return redirect('/')


def get_name_by_email(email, di):
    for name, email_address in di.items():
        if email_address == email:
            return name
    return None


@app.route('/quiz', methods=['GET', 'POST'])
def quiz():
    global name
    if 'user' not in session:
        return redirect('/login')

    user_email = session['user']
    logged_in = True

    check = db.child("users").get()
    di = dict(check.val())
    name = get_name_by_email(user_email, di)

    if request.method == 'POST':
        answers = request.form

        happiness_score = calculate_score(answers, 'happiness')
        sadness_score = calculate_score(answers, 'sadness')
        fear_score = calculate_score(answers, 'fear')
        anger_score = calculate_score(answers, 'anger')

        dominant_emotion = determine_dominant_emotion(happiness_score, sadness_score, fear_score, anger_score)

        quiz_data = {
            'happiness_score': happiness_score,
            'sadness_score': sadness_score,
            'fear_score': fear_score,
            'anger_score': anger_score
        }

        db.child(name).child('quiz').child('data').set(quiz_data)
        db.child(name).child('quiz').child('demo').set(dominant_emotion)

        return render_template('results.html',
                               dominant_emotion=dominant_emotion,
                               logged_in=logged_in,
                               user_email=user_email,
                               happiness_score=happiness_score,
                               sadness_score=sadness_score,
                               fear_score=fear_score,
                               anger_score=anger_score)
    else:
        return render_template('quiz.html', logged_in=logged_in, user_email=user_email)


def calculate_score(answers, emotion):
    option_to_emotion = {'A': 'happiness', 'B': 'sadness', 'C': 'fear', 'D': 'anger'}
    score = 0
    for _, answer in answers.items():
        option = answer.strip()
        if option_to_emotion.get(option) == emotion:
            score += 1
    return score


def determine_dominant_emotion(happiness_score, sadness_score, fear_score, anger_score):
    scores = {
        'happiness': happiness_score,
        'sadness': sadness_score,
        'fear': fear_score,
        'anger': anger_score
    }
    return max(scores, key=scores.get)


# --------------------------
# Emotion detection section
# --------------------------

emotion_counts = {'angry': 0, 'fear': 0, 'happy': 0, 'neutral': 0, 'sad': 0, 'surprise': 0}
session_id = str(uuid.uuid4())

def start_emotion_recognition():
    global emotion_counts, name

    json_file = open("./model/emotiondetector.json", "r")
    model_json = json_file.read()
    json_file.close()
    model = model_from_json(model_json)
    model.load_weights("./model/emotiondetector.h5")

    haar_file = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(haar_file)

    labels = {0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy', 4: 'neutral', 5: 'sad', 6: 'surprise'}

    def extract_features(image):
        feature = np.array(image).reshape(1, 48, 48, 1)
        return feature / 255.0

    webcam = cv2.VideoCapture(0)

    while True:
        ret, frame = webcam.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        try:
            for (x, y, w, h) in faces:
                image = gray[y:y + h, x:x + w]
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
                image = cv2.resize(image, (48, 48))
                img = extract_features(image)
                pred = model.predict(img)
                prediction_label = labels[pred.argmax()]
                emotion_counts[prediction_label] += 1
                cv2.putText(frame, f'Emotion: {prediction_label}', (x - 10, y - 10),
                            cv2.FONT_HERSHEY_COMPLEX_SMALL, 2, (0, 0, 255))
            cv2.imshow("Real-time Facial Emotion Recognition", frame)

            if cv2.waitKey(1) == 27:
                break
        except cv2.error:
            pass

    webcam.release()
    cv2.destroyAllWindows()


@app.route('/fetch_emotion_counts')
def fetch_emotion_counts():
    global emotion_counts, name
    db.child(name).child('emotion').set(emotion_counts)
    db.child(name).child('cemotion').set(emotion_counts)
    return jsonify(emotion_counts)


@app.route('/start_game', methods=['POST'])
def start_game():
    threading.Thread(target=start_emotion_recognition).start()
    return redirect('/game_in_progress')


@app.route('/game_in_progress')
def game_in_progress():
    if 'user' not in session:
        return redirect('/login')
    return render_template('game.html', logged_in=True, user_email=session['user'])


@app.route('/fetch_emotion_counts_in_game')
def fetch_emotion_counts_in_game():
    global emotion_counts, name
    db.child(name).child('emotioningame').set(emotion_counts)
    db.child(name).child('cemotion').set(emotion_counts)
    return jsonify(emotion_counts)


@app.route('/inside_game')
def inside_game():
    if 'user' not in session:
        return redirect('/login')
    return render_template('midgame.html', logged_in=True, user_email=session['user'])


@app.route('/fetch_emotion_counts_post_game')
def fetch_emotion_counts_post_game():
    global emotion_counts, name
    db.child(name).child('emotionpostgame').set(emotion_counts)
    db.child(name).child('cemotion').set(emotion_counts)
    return jsonify(emotion_counts)


@app.route('/post_game')
def post_game():
    if 'user' not in session:
        return redirect('/login')
    return render_template('postgame.html', logged_in=True, user_email=session['user'])


@app.route('/start_gameplay', methods=['POST'])
def start_gameplay():
    try:
        subprocess.Popen(['game\\StackOBot.exe'])
        return 'Game started successfully', 200
    except Exception as e:
        return f'Error starting game: {str(e)}', 500


@app.route('/profile')
def profile():
    if 'user' not in session:
        return redirect('/login')
    return render_template('profile.html', logged_in=True, name=name, user_email=session['user'])


@app.route('/final_report', methods=['GET', 'POST'])
def final_report():
    global emotion_counts, name
    if 'user' not in session:
        return redirect('/login')

    demo = db.child(name).child('quiz').child('demo').get().val()
    quiz = dict(db.child(name).child('quiz').child('data').get().val())
    emopre = dict(db.child(name).child('emotion').get().val())
    inemo = dict(db.child(name).child('emotioningame').get().val())
    emopost = dict(db.child(name).child('emotionpostgame').get().val())

    emotion_counts = {'angry': 0, 'fear': 0, 'happy': 0, 'neutral': 0, 'sad': 0, 'surprise': 0}

    return render_template('report.html',
                           logged_in=True,
                           name=name,
                           user_email=session['user'],
                           dgraph_json1=json.dumps(quiz),
                           demo=demo,
                           dgraph_json2=json.dumps(emopre),
                           dgraph_json3=json.dumps(inemo),
                           dgraph_json4=json.dumps(emopost)
                           )


if __name__ == '__main__':
    app.run(debug=True)
