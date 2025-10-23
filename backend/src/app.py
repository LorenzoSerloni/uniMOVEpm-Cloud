from flask import Flask, request, jsonify, send_file, make_response, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
from datetime import datetime
import csv
import io
from functools import wraps
from pathlib import Path
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables
load_dotenv("../../frontend/.env")

# Configuration
app.config['UPLOAD_FOLDER'] = 'data'  # Local folder to store simulation files
app.config['MAP_FOLDER'] = 'map'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Enable CORS for all routes
CORS(app, 
     origins="*",  # Update with your frontend URL
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "DELETE", "OPTIONS"])

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['MAP_FOLDER'], exist_ok=True)

# Global login state
# logged = False
logged_user = None

ACCESS_HISTORY_FILE = "./data/access_history.json"

def load_all_credentials():
    """Load all user credentials from environment variables."""
    credentials = []
    i = 1
    
    # Check for credentials without number suffix first (backward compatibility)
    if os.getenv("AUTHNAME") and os.getenv("AUTHUSER") and os.getenv("AUTHPASSWORD"):
        credentials.append({
            "name": os.getenv("AUTHNAME"),
            "username": os.getenv("AUTHUSER"),
            "password": os.getenv("AUTHPASSWORD")
        })
    
    # Then check for numbered credentials
    while True:
        name = os.getenv(f"AUTHNAME_{i}")
        username = os.getenv(f"AUTHUSER_{i}")
        password = os.getenv(f"AUTHPASSWORD_{i}")
        
        if not (name and username and password):
            break
            
        credentials.append({
            "name": name,
            "username": username,
            "password": password
        })
        i += 1
    
    return credentials


def log_access(username, name, success=True, ip_address=None):
    """Log user access attempts to access_history.json."""
    # Create Data directory if it doesn't exist
    os.makedirs("./data", exist_ok=True)
    
    # Load existing history
    history = []
    if os.path.exists(ACCESS_HISTORY_FILE):
        try:
            with open(ACCESS_HISTORY_FILE, 'r') as f:
                history = json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            history = []
    
    # Add new entry
    entry = {
        "timestamp": datetime.now().isoformat(),
        "name": name,
        "username": username,
        "success": success,
        "ip_address": ip_address or request.remote_addr
    }
    history.append(entry)
    
    # Save updated history
    with open(ACCESS_HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=2)

def auth_required(f):
    """Decorator to require cookie authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.cookies.get("auth") != "True":
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated

# @app.route('/login', methods=['POST'])
# def login():
#     """Login endpoint using environment variables and cookies"""
#     global logged
    
#     if request.method == "POST":
#         data = request.get_json()
        
#         if not data or not data.get('username') or not data.get('password'):
#             return jsonify({'error': 'Username and password required'}), 400
        
#         username = data["username"]
#         password = data["password"]
        
#         if (
#             username == os.getenv("AUTHUSER")
#             and password == os.getenv("AUTHPASSWORD")
#             and not logged
#         ):
#             logged = True
#             res = make_response(jsonify({"message": "Login successful"}))
#             res.set_cookie("auth", "True", path="/", samesite="Lax", secure=False)
#             return res
#         elif logged:
#             return jsonify({"error": "User already logged"}), 403
#         else:
#             return jsonify({"error": "Authentication failed"}), 401

@app.route("/login", methods=["POST"])
def login():
    global logged_user
    
    if request.method == "POST":
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400
        
        # Load all credentials
        credentials = load_all_credentials()
        
        if not credentials:
            return jsonify({"error": "No credentials configured"}), 500
        
        # Check if any user is already logged in (single session only)
        if logged_user is not None:
            log_access(username, "Unknown", success=False, ip_address=request.remote_addr)
            return jsonify({"error": "Another user is already logged in. Please try again later."}), 403
        
        # Verify credentials
        authenticated_user = None
        for cred in credentials:
            if cred["username"] == username and cred["password"] == password:
                authenticated_user = cred
                break
        
        if authenticated_user:
            # Log successful access
            log_access(username, authenticated_user["name"], success=True, ip_address=request.remote_addr)
            
            # Mark user as logged in
            logged_user = {
                "username": username,
                "name": authenticated_user["name"]
            }
            
            res = make_response(jsonify({
                "message": "Login successful",
                "name": authenticated_user["name"]
            }))
            res.set_cookie("auth-cloud", "True", path="/", samesite="Lax", secure=False)
            res.set_cookie("username-cloud", username, path="/", samesite="Lax", secure=False)
            return res
        else:
            # Log failed access attempt
            log_access(username, "Unknown", success=False, ip_address=request.remote_addr)
            return jsonify({"error": "Authentication failed"}), 401

# @app.route("/logout", methods=['GET'])
# def logout():
#     """Logout endpoint"""
#     if request.cookies.get("auth") == "True":
#         global logged
#         logged = False
#         res = make_response(jsonify({"message": "Logout successful"}))
#         res.set_cookie("auth", "", expires=0)
#         return res
#     return jsonify({"message": "Need to be logged in to logout"}), 403

@app.route("/logout")
def handle_logout():
    if request.cookies.get("auth-cloud") == "True":
        global logged_user
        logged_user = None  # Clear the single logged-in user
        
        res = make_response(jsonify({"message": "Logout Successful"}))
        res.set_cookie("auth-cloud", "", expires=0)
        res.set_cookie("username-cloud", "", expires=0)
        return res
    return jsonify({"error": "Need to be logged in to logout"}), 403

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint - equivalent to AWS Lambda health check"""
    return jsonify('Hello from Flask!')

@app.route('/names', methods=['GET'])
def get_names():
    """Get file names - equivalent to AWS Lambda get names function"""
    try:
        date_param = request.args.get('date')
        
        if not date_param:
            # Return all files organized by date
            result = []
            data_path = Path(app.config['UPLOAD_FOLDER'])
            
            if data_path.exists():
                for date_folder in data_path.iterdir():
                    if date_folder.is_dir():
                        files = [f.name for f in date_folder.iterdir() if f.is_file()]
                        if files:
                            result.append({
                                "date": date_folder.name,
                                "files": files
                            })
            
            return jsonify(result)
        
        # Return files for specific date
        date_folder = Path(app.config['UPLOAD_FOLDER']) / date_param
        
        if date_folder.exists() and date_folder.is_dir():
            files = [f.name for f in date_folder.iterdir() if f.is_file()]
            if files:
                return jsonify({
                    "date": date_param,
                    "files": files
                })
        
        return jsonify('No files found'), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/data', methods=['GET'])
def get_file():
    """Get specific file - equivalent to AWS Lambda get file function"""
    try:
        date = request.args.get('date')
        time = request.args.get('time')
        
        if not date or not time:
            return jsonify({'error': 'Date and time parameters required'}), 400
        
        file_path = Path(app.config['UPLOAD_FOLDER']) / date / f"{time}.csv"
        
        if file_path.exists():
            return send_file(
                file_path,
                as_attachment=True,
                download_name=f"{time}.csv",
                mimetype='text/csv'
            )
        
        return jsonify('File not found'), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/data', methods=['POST'])
def insert_file():
    """Insert file - stores both CSV and SVG map"""
    try:
        if 'file' not in request.files or 'map_file' not in request.files:
            return jsonify({'error': 'Both file and map_file are required'}), 400
        
        file = request.files['file']
        map_file = request.files['map_file']

        if file.filename == '' or map_file.filename == '':
            return jsonify({'error': 'Invalid file(s) provided'}), 400

        # Generate timestamp
        now = datetime.now()
        date = now.strftime("%d-%m-%Y")
        time_str = now.strftime("%H-%M-%S")

        # Create folders if needed
        date_folder = Path(app.config['UPLOAD_FOLDER']) / date
        date_folder.mkdir(exist_ok=True)
        map_folder = Path(app.config['MAP_FOLDER']) / date
        map_folder.mkdir(exist_ok=True)

        # Save CSV
        csv_filename = f"{time_str}.csv"
        csv_path = date_folder / csv_filename
        file.save(csv_path)

        # Save SVG map
        map_filename = f"{time_str}.svg"
        map_path = map_folder / map_filename
        map_file.save(map_path)

        return jsonify(f"Files saved: {date}/{csv_filename} and {date}/{map_filename}")

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/download', methods=['GET'])
def download_csv():
    """Download CSV file directly to browser"""
    try:
        date = request.args.get('date')
        time = request.args.get('time')

        print("request_received")

        if not date or not time:
            return jsonify({'error': 'Date and time parameters required'}), 400

        file_path = Path(app.config['UPLOAD_FOLDER']) / date / f"{time}.csv"

        if not file_path.exists():
            return jsonify({'error': 'File not found'}), 404

        # Send the CSV for download
        return send_file(
            file_path,
            as_attachment=True,
            download_name=f"{date}_{time}.csv",
            mimetype='text/csv'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/data', methods=['DELETE'])
def remove_file():
    """Remove file and corresponding map - equivalent to AWS Lambda remove file function"""
    try:
        data = request.get_json()
        
        if not data or not data.get('date') or not data.get('time'):
            return jsonify({'error': 'Date and time required'}), 400
        
        date = data.get('date')
        time = data.get('time')
        
        # Paths for both CSV and SVG
        csv_path = Path(app.config['UPLOAD_FOLDER']) / date / f"{time}.csv"
        svg_path = Path(app.config['MAP_FOLDER']) / date / f"{time}.svg"
        
        removed_files = []
        missing_files = []

        # Remove CSV if exists
        if csv_path.exists():
            csv_path.unlink()
            removed_files.append(f"{date}/{time}.csv")
        else:
            missing_files.append(f"{date}/{time}.csv")

        # Remove SVG map if exists
        if svg_path.exists():
            svg_path.unlink()
            removed_files.append(f"{date}/{time}.svg")
        else:
            missing_files.append(f"{date}/{time}.svg")

        if removed_files:
            return jsonify({
                'message': 'Files deleted successfully',
                'deleted': removed_files,
                'missing': missing_files
            }), 200
        else:
            return jsonify({
                'error': 'No files found to delete',
                'missing': missing_files
            }), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/files', methods=['GET'])
def list_all_files():
    """Additional endpoint to list all files with details"""
    try:
        result = []
        data_path = Path(app.config['UPLOAD_FOLDER'])
        
        if data_path.exists():
            for date_folder in sorted(data_path.iterdir()):
                if date_folder.is_dir():
                    for file_path in sorted(date_folder.iterdir()):
                        if file_path.is_file() and file_path.suffix == '.csv':
                            stat = file_path.stat()
                            result.append({
                                'date': date_folder.name,
                                'filename': file_path.name,
                                'size': stat.st_size,
                                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                            })
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route("/map/<date>/<filename>")
def serve_map(date, filename):
    folder = os.path.join(os.path.join(os.path.dirname(__file__), "map"), date)
    return send_from_directory(folder, filename)

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Flask server starting...")
    print("Available endpoints:")
    print("  GET  /              - Health check")
    print("  POST /login         - User login")
    print("  GET  /logout        - User logout")
    print("  GET  /names         - Get file names")
    print("  GET  /data          - Get specific file")
    print("  POST /data          - Upload file")
    print("  DELETE /data        - Delete file")
    print("  GET  /files         - List all files with details")
    print(f"Files will be stored in: {os.path.abspath(app.config['UPLOAD_FOLDER'])}")
    print("Make sure to set AUTHUSER and AUTHPASSWORD in your .env file")
    
    mode = os.getenv("VITE_MODE")
    if mode == "local":
        app.run(debug=True, port=5001)
    elif mode == "production":
        app.run(debug=True, host="0.0.0.0", port=5001)
    else:
        print("error running app.py")
        exit(1)
