from flask import Flask, request, jsonify
from flask_cors import CORS
from src.capture_faces import capture_faces
from src.preprocess import preprocess_dataset 
from src.lbp import lpb_dataset
from src.histogram import lpb_features
from src.trainer import lpbh_model
from src.recognizer import face_recognition
import os
import shutil
from flask import jsonify

app = Flask(__name__)
CORS(app)

@app.route('/capture', methods=['POST'])
def capture_route():
    try:
        data = request.json
        person_name = data.get('person_name')
        if not person_name:
            return jsonify({'success': False, 'error': 'No person name provided'}), 400
        # This will open the webcam and show live preview
        img_count = capture_faces(person_name)
        return jsonify({
            'success': True,
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/preprocess', methods=['POST'])
def preprocess_route():
    """
    JSON:
    {
        "dataset_path": "dataset",
        "processed_path": "processed_dataset"
    }
    """
    data = request.json or {}
    dataset_path = data.get('dataset_path', 'dataset')
    processed_path = data.get('processed_path', 'processed_dataset')

    try:
        processed_count = preprocess_dataset(dataset_path, processed_path)
        return jsonify({
            'success': True,
            'images_processed': processed_count,
            'message': f"Preprocessed {processed_count} images successfully."
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    
@app.route('/compute_lbp', methods=['POST'])
def compute_lbp_route():
    data = request.json or {}
    processed_path = data.get('processed_path', 'processed_dataset')
    lbp_path = data.get('lbp_path', 'lbp_dataset')
    try:
        lpb_dataset(processed_path, lbp_path)
        return jsonify({
            'success': True,
            'message': f"LBP computation completed for {processed_path}."
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/extract_features', methods=['POST'])
def extract_features_route():
    data = request.json or {}
    lbp_path = data.get('lbp_path', 'lbp_dataset')
    features_path = data.get('features_path', 'features')
    try:
        lpb_features(lbp_path, features_path)
        return jsonify({
            'success': True,
            'message': f"Feature extraction completed for {lbp_path}."
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    

@app.route('/create_model', methods=['POST'])
def create_model_route():
    data = request.json or {}
    features_path = data.get('features_path', 'features/features.npy')
    labels_path = data.get('labels_path', 'features/labels.npy')
    person_names_path = data.get('person_names_path', 'features/person_names.pkl')
    model_path = data.get('model_path', 'models/lbph_model.pkl')

    try:
        total_faces = lpbh_model(features_path, labels_path, person_names_path, model_path)
        return jsonify({
            'success': True,
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/recognize', methods=['POST'])
def recognize_route():
    try:
        data = request.get_json()
        state = data.get("state")  # Changed from "state" to "status"
        detected_name = face_recognition(state)  # Capture the return value
        return jsonify({
            'success': True,
            'detected_name': detected_name,
            'message': 'Face recognition session completed.'
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)



@app.route('/delete-face/<string:username>', methods=['DELETE'])
def delete_face(username):
    try:
        base_paths = [
            os.path.join('dataset', username),
            os.path.join('lpb_dataset', username),
            os.path.join('processed_dataset', username),
        ]
        feature_file = os.path.join('features', f'{username}.npy')
        model_file = os.path.join('models', 'lbph_model.pkl')

        deleted_items = []

        # Delete user-specific folders
        for path in base_paths:
            if os.path.exists(path):
                shutil.rmtree(path)
                deleted_items.append(path)

        # Delete feature file if exists
        if os.path.exists(feature_file):
            os.remove(feature_file)
            deleted_items.append(feature_file)

        # Optionally update LBPH model
        if os.path.exists(model_file):
            print(f"ℹ️ lbph_model.pkl exists at {model_file}. You can retrain it later.")
            # You could remove or retrain model if desired

        if not deleted_items:
            return jsonify({"message": f"No face data found for {username}"}), 404

        print(f"✅ Deleted face data for {username}: {deleted_items}")
        return jsonify({
            "success": True,
            "message": f"Deleted face data for {username}",
            "deleted": deleted_items
        }), 200

    except Exception as e:
        print("❌ Error deleting face data:", e)
        return jsonify({"error": str(e)}), 500
