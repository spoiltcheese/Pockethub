import bcrypt

from flask import request, jsonify, Blueprint, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

from db.db_pool import get_cursor, release_connection

auth = Blueprint('auth', __name__, url_prefix='/auth')

@auth.route('/register', methods=['POST'])
def register():
    inputs = request.get_json()
    conn, cursor = get_cursor()
    cursor.execute("SELECT uuid FROM auth WHERE email = %s", (inputs['email'],))
    result = cursor.fetchone()



    if result:
        return jsonify(status='error', msg='Email already registered')

    hashed_password = bcrypt.hashpw(inputs['password'].encode('utf-8'), bcrypt.gensalt())

    print("Values being inserted:")
    print(f"Email: '{inputs['email']}'")
    print(f"Name: '{inputs['name']}'")
    print(f"Hash: '{hashed_password.decode('utf-8')}'")
    print(f"GameID: '{inputs['gameID']}'")

    cursor.execute(
        "INSERT INTO auth (email, name, hash, gameID) VALUES (%s, %s, %s, %s)",
        (inputs['email'], inputs['name'], hashed_password.decode('utf-8'), inputs['gameID']))
    conn.commit()
    release_connection(conn)

    return jsonify(status='ok', msg='registration successful'), 200

@auth.route('/login', methods=['POST'])
def login():
    inputs = request.get_json()
    conn, cursor = get_cursor()
    cursor.execute("SELECT * FROM auth WHERE email = %s", (inputs['email'],))
    result = cursor.fetchone()
    release_connection(conn)

    if not result:
        return jsonify(status='error', msg='Email or Password incorrect'), 400

    access = bcrypt.checkpw(inputs['password'].encode('utf-8'), result['hash'].encode('utf-8'))
    if not access:
        return jsonify(status='error', msg='Email or Password incorrect'), 400

    claims = {'name': result['name'], 'gameID': result['gameid'], 'role': result['role']}
    access_token = create_access_token(result['email'], additional_claims=claims)
    refresh_token = create_access_token(result['email'], additional_claims=claims)

    return jsonify(status='ok', access_token=access_token, refresh_token=refresh_token), 200

@auth.route('/refresh')
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    claims = get_jwt()

    access_token = create_access_token(identity=identity, additional_claims=claims)

    return jsonify(status='ok', access_token=access_token), 200


