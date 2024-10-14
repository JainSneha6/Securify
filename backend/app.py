from flask import Flask, request, jsonify, send_file
import os
import cv2
import numpy as np
import sounddevice as sd
import soundfile as sf
from resemblyzer import VoiceEncoder, preprocess_wav
from fer import FER
from pathlib import Path
from flask_cors import CORS
import threading
from PIL import Image
import io
import base64
import json
import serial
import time

app = Flask(__name__)
CORS(app)

# Initialize emotion dictionary and file path
emotion_dict_file = 'emotion_data.json'
emotion_dict = {}

serial_lock = threading.Lock()


# Load emotion dictionary from the file (if exists)
if os.path.exists(emotion_dict_file):
    with open(emotion_dict_file, 'r') as file:
        emotion_dict = json.load(file)

def send_analog_input(value):
    with serial_lock:
        arduino.write(bytes(value, 'utf-8'))
        time.sleep(0.05)

# Utility function to create a dataset directory
def create_dataset_dir(name, model_type='face'):
    dataset_path = f'{model_type}_dataset/{name}'
    os.makedirs(dataset_path, exist_ok=True)
    return dataset_path

# Function to save base64 images to the disk
def save_base64_image(image_data, image_path):
    with open(image_path, 'wb') as f:
        f.write(base64.b64decode(image_data.split(',')[1]))  # Split base64 header and decode

# Route to handle image uploads
emotion = " "

@app.route('/upload_images', methods=['POST'])
def upload_images():
    data = request.json
    name = data['name']
    emotion = data['emotion']  # Get the emotion from the request
    images = data['images']  # Array of base64-encoded image data
    dataset_path = create_dataset_dir(name, 'face')

    # Save the images to the dataset folder
    for idx, img_data in enumerate(images):
        img_path = os.path.join(dataset_path, f'{idx + 1}.jpg')
        save_base64_image(img_data, img_path)

    emotion_dict[name] = emotion
    with open(emotion_dict_file, 'w') as file:
        json.dump(emotion_dict, file)

    # Store emotion in a variable or database (if needed)
    # For now, we'll just print it to show it's captured
    print(f"Emotion selected for {name}: {emotion}")

    # Start training the face recognition model in a separate thread
    threading.Thread(target=train_face_model, args=(name, emotion)).start()

    return jsonify({"message": f"Images for {name} uploaded and model training started with emotion '{emotion}'."}), 200

# Train face model function with emotion
def train_face_model(name, emotion):
    dataset_path = f'face_dataset/{name}'
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    face_samples, ids = [], []

    for img_id, img_name in enumerate(os.listdir(dataset_path)):
        img_path = os.path.join(dataset_path, img_name)
        img_path = img_path.replace("\\", "/")  # Ensure the path is properly formatted
        print(f"Processing image: {img_path}")
        
        # Load the image and convert it to grayscale
        img = cv2.imread(img_path)
        if img is None:
            print(f"Error loading image: {img_path}")
            continue
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Detect faces using HaarCascade
        faces = face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1,   # Adjust scaleFactor (default is 1.3, try 1.1 for more granularity)
            minNeighbors=3,    # Adjust minNeighbors (default is 5, lower for more faces)
            minSize=(30, 30)   # Ensure a minimum face size (adjust as needed)
        )

        print(f"Detected {len(faces)} face(s) in image {img_name}")

        # Visualize face detection for debugging
        for (x, y, w, h) in faces:
            face_region = gray[y:y+h, x:x+w]
            
            # Optionally, draw rectangle around the face (for debugging)
            cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)

            # Resize and preprocess face region
            face_region_resized = cv2.resize(face_region, (200, 200))
            face_normalized = cv2.equalizeHist(face_region_resized)

            face_samples.append(face_normalized)
            ids.append(img_id + 1)

        cv2.destroyAllWindows()  # Close any open windows after showing detected faces

    # Check if we have valid faces for training
    if face_samples and ids:
        recognizer.train(face_samples, np.array(ids))

        # Save the trained model
        model_file_path = f'face_trainer/{name}.yml'
        os.makedirs('face_trainer', exist_ok=True)
        recognizer.save(model_file_path)
        print(f"Model for {name} trained with emotion '{emotion}' and saved at {model_file_path}.")
    else:
        print(f"No valid faces detected to train on for {name} with emotion '{emotion}'.")

def get_images_and_labels(dataset_path):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    face_samples = []
    ids = []
    for image_file in os.listdir(dataset_path):
        if image_file.endswith('.jpg'):
            image_path = os.path.join(dataset_path, image_file)
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            faces = face_cascade.detectMultiScale(img, scaleFactor=1.3, minNeighbors=5)
            for (x, y, w, h) in faces:
                face_samples.append(img[y:y+h, x:x+w])
                ids.append(int(os.path.split(image_file)[-1].split('.')[0]))
    return face_samples, ids

# Route to recognize face with emotion detection
@app.route('/recognize_face', methods=['POST'])
def recognize_face():
    person_name = request.json['name']
    
    images = request.json['images']  # Array of base64-encoded images
    model_file_path = f'face_trainer/{person_name}.yml'
    
    if not os.path.exists(model_file_path):
        return jsonify({"message": f"Model for {person_name} not found."}), 404

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(model_file_path)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    emotion_detector = FER()

    matched = False
    detected_emotion = None

    # Get stored emotion from the emotion dictionary
    if person_name in emotion_dict:
        stored_emotion = emotion_dict[person_name]  # Emotion stored for this person
        print(stored_emotion)
    else:
        return jsonify({"message": f"No emotion data found for {person_name}."}), 404

    # Process each image
    for img_data in images:
        img_bytes = base64.b64decode(img_data.split(',')[1])
        np_img = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

        for (x, y, w, h) in faces:
            face_region = gray[y:y+h, x:x+w]
            face_id, confidence = recognizer.predict(face_region)

            # Emotion detection
            rgb_face = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            emotion = emotion_detector.detect_emotions(rgb_face)
            if len(emotion) > 0:
                detected_emotion = max(emotion[0]['emotions'], key=emotion[0]['emotions'].get)
                
                # Check if the face is recognized and the emotion matches the stored emotion
                if confidence < 70 and detected_emotion == stored_emotion:
                    matched = True
                    send_analog_input('1')
                    return jsonify({
                        "result": "Matched"
                        # "confidence": round(100 - confidence), 
                        # "emotion": detected_emotion
                    })

    # If no match was found
    if not matched:
        return jsonify({
            "result": "Not Matched"
            # "emotion": detected_emotion
        })


# Route to record voice samples for dataset
@app.route('/record_voice', methods=['POST'])
def record_voice():
    name = request.json['name']
    dataset_path = create_dataset_dir(name, 'voice')
    print(dataset_path)
    for i in range(5):  # Record 5 samples
        print(dataset_path)
        file_path = f"{dataset_path}/sample_{i+1}.wav"
        file_path.replace(' ','')
        print(file_path)
        record_audio(file_path)
    train_voice(name)
    return jsonify({"message": f"Recorded 5 voice samples for {name}."})

def record_audio(filename, duration=5, fs=16000):
    audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype=np.int16)
    sd.wait()
    sf.write(filename, audio_data, fs)


def train_voice(name):
    dataset_path = f"voice_dataset/{name}"
    encoder = VoiceEncoder()
    embeddings = []
    
    for file in os.listdir(dataset_path):
        if file.endswith('.wav'):
            filepath = os.path.join(dataset_path, file)
            wav = preprocess_wav(Path(filepath))
            embedding = encoder.embed_utterance(wav)
            embeddings.append(embedding)

    os.makedirs('voice_profiles', exist_ok=True)

    
    np.save(f'voice_profiles/{name}_embeddings.npy', embeddings)
    print({"message": f"Voice embeddings for {name} saved."})

# Route to recognize voice
@app.route('/recognize_voice', methods=['POST'])
def recognize_voice():
    name = request.json['name']
    embedding_path = f'voice_profiles/{name}_embeddings.npy'
    
    if not os.path.exists(embedding_path):
        return jsonify({"message": f"Embedding for {name} not found."}), 404
    
    user_embedding = np.load(embedding_path)
    
    test_file = "test_sample.wav"
    record_audio(test_file)
    encoder = VoiceEncoder()
    wav = preprocess_wav(test_file)
    test_embedding = encoder.embed_utterance(wav)
    
    similarity = cosine_similarity(np.mean(user_embedding, axis=0), test_embedding)
    similarity = float(similarity)
    if similarity > 0.8:
        send_analog_input('1')
        return jsonify({"result": "Matched", "similarity": similarity})
    else:
        return jsonify({"result": "Not Matched", "similarity": similarity})

def cosine_similarity(embedding1, embedding2):
    return np.dot(embedding1, embedding2) / (np.linalg.norm(embedding1) * np.linalg.norm(embedding2))

def initialize_serial():
    try:
        return serial.Serial(port='COM5', baudrate=9600, timeout=0.1)
    except serial.SerialException as e:
        print(f"Error opening serial port: {e}")
        return None

if __name__ == '__main__':
    arduino = initialize_serial()
    if arduino:
        app.run(debug=True, use_reloader=False)
    else:
        print("Failed to initialize serial connection. Exiting.")
