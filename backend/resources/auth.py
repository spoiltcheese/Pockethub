import bcrypt

from flask import request, jsonify, Blueprint, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

from db.db_pool import get_cursor, release_connection

import psycopg2

auth = Blueprint('auth', __name__, url_prefix='/auth')

@auth.route('/register', methods=['POST'])
def register():
    conn = None
    try:
        inputs = request.get_json()
        conn, cursor = get_cursor()
        cursor.execute("SELECT uuid FROM auth WHERE email = %s", (inputs['email'],))
        result = cursor.fetchone()

        if result:
            return jsonify(status='error', msg='Email already registered')

        hashed_password = bcrypt.hashpw(inputs['password'].encode('utf-8'), bcrypt.gensalt())

        cursor.execute(
            "INSERT INTO auth (email, name, hash, gameID) VALUES (%s, %s, %s, %s)",
            (inputs['email'], inputs['name'], hashed_password.decode('utf-8'), inputs['gameID']))
        conn.commit()

        return jsonify(status='ok', msg='registration successful'), 200


    except SyntaxError as err:
        return jsonify({'status': 'error'}), 400

    except Exception as err:
        return jsonify({'status': 'error'}), 400


    finally:
        release_connection(conn)

@auth.route('/login', methods=['POST'])
def login():
    conn = None
    try:
        inputs = request.get_json()
        conn, cursor = get_cursor()
        cursor.execute("SELECT * FROM auth WHERE email = %s", (inputs['email'],))
        result = cursor.fetchone()

        if not result:
            return jsonify(status='error', msg='Email or Password incorrect'), 400

        access = bcrypt.checkpw(inputs['password'].encode('utf-8'), result['hash'].encode('utf-8'))
        if not access:
            return jsonify(status='error', msg='Email or Password incorrect'), 400

        claims = {'name': result['name'], 'gameID': result['gameid'], 'role': result['role']}
        access_token = create_access_token(result['email'], additional_claims=claims)
        refresh_token = create_access_token(result['email'], additional_claims=claims)

        return jsonify(status='ok', access_token=access_token, refresh_token=refresh_token), 200

    except SyntaxError as err:
        return jsonify({'status': 'error'}), 400

    except Exception as err:
        return jsonify({'status': 'error'}), 400



    finally:
        if conn is not None:
            release_connection(conn)

@auth.route('/refresh')
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    claims = get_jwt()

    access_token = create_access_token(identity=identity, additional_claims=claims)

    return jsonify(status='ok', access_token=access_token), 200

@auth.route('/users')
@jwt_required()
def get_users():
    claims = get_jwt()
    if claims['role'] != 'admin':
       return jsonify(status='error', msg='Unauthorised'), 401

    conn = None
    try:
        conn, cursor = get_cursor()
        cursor.execute("SELECT * FROM auth")
        result = cursor.fetchall()

        return jsonify(result), 200

    except SyntaxError as err:
        return jsonify({'status': 'error'}), 400

    except Exception as err:
        return jsonify({'status': 'error'}), 400


    finally:
        release_connection(conn)


@auth.route('/changeDetails', methods=['POST'])
@jwt_required()
def change_details():
    conn = None

    identity = get_jwt_identity()

    inputs = request.get_json()

    try:
        conn, cursor = get_cursor()
        cursor.execute("SELECT * FROM auth WHERE email = %s", (identity,))
        result = cursor.fetchone()

        if not result:
            return jsonify(status='error', msg='Email or Password incorrect'), 400

        access = bcrypt.checkpw(inputs['password'].encode('utf-8'), result['hash'].encode('utf-8'))
        if not access:
            return jsonify(status='error', msg='Email or Password incorrect'), 400

        hashed_password = bcrypt.hashpw(inputs['newPassword'].encode('utf-8'), bcrypt.gensalt())

        cursor.execute(
            "UPDATE auth SET gameid=%s, hash=%s WHERE email= %s",
            (inputs['gameID'],  hashed_password.decode('utf-8'), identity))
        conn.commit()

        return jsonify(status='ok', msg='success'), 200

    except psycopg2.Error as db_err:  # Catch database-specific errors

        if conn:
            conn.rollback()

        return jsonify({'status': 'error', "message": str(db_err)}), 400


    except KeyError as key_err:

        return jsonify({'status': 'error', "message": f"Missing required field: {key_err}"}), 400

    except Exception as err:

        if conn:
            conn.rollback()

        return jsonify({'status': 'error', "message": str(err)}), 400


    finally:

        release_connection(conn)


@auth.route('/getCurrentUserGameID')
@jwt_required()
def getSingleGID():
    conn = None
    try:
        identity = get_jwt_identity()

        conn, cursor = get_cursor()
        cursor.execute("SELECT gameid FROM auth WHERE email = %s", (identity,))
        result = cursor.fetchone()

        return jsonify(result), 200


    except psycopg2.Error as db_err:  # Catch database-specific errors

        if conn:
            conn.rollback()

        return jsonify({'status': 'error', "message": str(db_err)}), 400



    except KeyError as key_err:

        return jsonify({'status': 'error', "message": f"Missing required field: {key_err}"}), 400


    except Exception as err:

        if conn:
            conn.rollback()

        return jsonify({'status': 'error', "message": str(err)}), 400



    finally:

        release_connection(conn)




