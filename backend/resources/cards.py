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
        cursor.execute("SELECT * FROM cards WHERE cardrarity = %s", (inputs['rarity'],))
        result = cursor.fetchall()

        return jsonify(result), 200

    except SyntaxError as err:
        return jsonify({'status': 'error'}), 400

    except Exception as err:
        return jsonify({'status': 'error'}), 400


    finally:
        release_connection(conn)
