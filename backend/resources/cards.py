from flask import request, jsonify, Blueprint
from db.db_pool import get_cursor, release_connection
from marshmallow import ValidationError
from validators.tools import AddOneToolsSchema
from flask_jwt_extended import jwt_required

import psycopg2

cards = Blueprint('cards', __name__)
@cards.route('/cards')
# @jwt_required()
def find_all_cards():
    conn = None
    try:
        conn, cursor = get_cursor()
        cursor.execute("SELECT * FROM cards")
        result = cursor.fetchall()

        return jsonify(result), 200

    except SyntaxError as err:
        return jsonify({'status': 'error'}), 400

    except Exception as err:
        return jsonify({'status': 'error'}), 400


    finally:
        release_connection(conn)


@cards.route('/card_media')
# @jwt_required()
def find_all_card_media():
    conn = None
    try:
        conn, cursor = get_cursor()
        cursor.execute("SELECT * FROM media")
        result = cursor.fetchall()

        return jsonify(result), 200

    except SyntaxError as err:
        return jsonify({'status': 'error'}), 400

    except Exception as err:
        return jsonify({'status': 'error'}), 400


    finally:
        release_connection(conn)

@cards.route('/cards_filtered' , methods=['POST'])
def find_filtered_cards():
    conn = None
    try:
        conn, cursor = get_cursor()
        inputs = request.get_json()
        cursor.execute("""
                        SELECT * FROM "cards" c 
                        JOIN media m on m."id"::VARCHAR = c."cardnumber"
                        WHERE cardrarity = %s
                        """, (inputs['rarity'],))
        result = cursor.fetchall()

        return jsonify(result), 200

    except psycopg2.Error as db_err:  # Catch database-specific errors

        print(f"Database error: {db_err}")

        if conn:
            conn.rollback()

        return jsonify({'status': 'error', "message": str(db_err)}), 400

    except KeyError as key_err:
        print(f"Missing key in input: {key_err}")
        return jsonify({'status': 'error', "message": f"Missing required field: {key_err}"}), 400


    except Exception as err:

        print(f"General error: {err}")

        if conn:
            conn.rollback()

        return jsonify({'status': 'error', "message": str(err)}), 400


    finally:
        release_connection(conn)



@cards.route('/single_card_media' , methods=['POST'])
def find_one_card_media():
    conn = None
    try:
        conn, cursor = get_cursor()
        inputs = request.get_json()
        cursor.execute("""
                        SELECT * FROM media
                        WHERE "id" = %s
                        """, (inputs['cardID'],))
        result = cursor.fetchall()

        return jsonify(result), 200

    except SyntaxError as err:
        return jsonify({'status': 'error'}), 400

    except Exception as err:
        return jsonify({'status': 'error'}), 400


    finally:
        release_connection(conn)