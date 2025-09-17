from flask import request, jsonify, Blueprint
from db.db_pool import get_cursor, release_connection
from marshmallow import ValidationError
from validators.tools import AddOneToolsSchema
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

import psycopg2

trades= Blueprint('trades', __name__)
@trades.route('/trades')
# @jwt_required()
def find_all_trades():
    conn = None
    try:
        conn, cursor = get_cursor()
        # cursor.execute("""select DISTINCT
        #                 c1."cardname" as lookingfor_cardname,
        #                 c2."cardname" as tradingwith_cardname,
        #                 u."gameid" as "traderID",
        #                 u."name" as "traderName"
        #                 from "trades" t
        #                 join cards c1 on c1.cardnumber = t.lookingfor
        #                 join cards c2 on c2.cardnumber = t.tradingwith
        #                 join "auth" u on u."gameid" = t."traderid"
        #                 """)

        cursor.execute("""
                        select DISTINCT * from trades
                        """)

        result = cursor.fetchall()

        return jsonify(result), 200

    except SyntaxError as err:
        return jsonify({'status': 'syntax error', 'message': err }), 400

    except Exception as err:
        return jsonify({'status': 'error','message': err}), 400


    finally:
        release_connection(conn)

@trades.route('/myTrades' , methods=['POST'])
# @jwt_required()
def find_user_trades():
    conn = None
    try:
        conn, cursor = get_cursor()
        inputs = request.get_json()
        cursor.execute("""
                        select DISTINCT * FROM trades
                        where "traderid" = %s
                        """,
                       (inputs['gameID'],))
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

@trades.route('/addTrade', methods=['POST'])
def add_trade():
    conn = None
    try:
        conn, cursor = get_cursor()
        inputs = request.get_json()

        print("Values being inserted:")
        print(f"lookingfor: '{inputs['lookingfor']}'")
        print(f"tradingwith: '{inputs['tradingwith']}'")
        print(f"GameID: '{inputs['traderID']}'")

        #TODO: add pending status
        cursor.execute(
            """
            INSERT INTO trades (lookingfor, tradingwith, traderid) VALUES (%s, %s, %s)
            """,
            (inputs['lookingfor'], inputs['tradingwith'], inputs['traderID']))

        # Check if the row was actually inserted
        print(f"Rows affected: {cursor.rowcount}")

        conn.commit()
        print("Transaction committed successfully")

        return jsonify(status='ok', msg='addition successful'), 200

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

@trades.route('/trades/<trade_id>')
# @jwt_required()
def find_single_trades(trade_id):
    conn = None
    try:
        conn, cursor = get_cursor()

        cursor.execute("""select DISTINCT *
                        from "trades" t
                        where t."uuid" = %s
                        """,
                       (trade_id,))
        result = cursor.fetchall()

        return jsonify(result), 200

    except SyntaxError as err:
        return jsonify({'status': 'error'}), 400

    except Exception as err:
        return jsonify({'status': 'error'}), 400


    finally:
        release_connection(conn)


@trades.route('/trades/<trade_id>' , methods=['POST'])
@jwt_required()
def find_single_trade_filtered(trade_id):
    conn = None
    try:
        conn, cursor = get_cursor()
        inputs = request.get_json()
        cursor.execute("""select DISTINCT *
                        from "trades" t
                        where t."uuid" = %s
                        and i."traderid" != %s
                        """,
                       (trade_id,inputs['gameID']))
        result = cursor.fetchall()

        return jsonify(result), 200

    except SyntaxError as err:
        return jsonify({'status': 'error'}), 400

    except Exception as err:
        return jsonify({'status': 'error'}), 400


    finally:
        release_connection(conn)

@trades.route('/trades/acceptTrade' , methods=['POST'])
@jwt_required()
def accept_trade():
    conn = None

    try:
        conn, cursor = get_cursor()
        inputs = request.get_json()

        claims = get_jwt()

        print(f"{claims["gameID"]}")

        cursor.execute("""
                        UPDATE trades
                        SET "status" = 'ACCEPTED', "tradeeid" = %s
                        where "uuid" = %s
                        """,
                       (claims["gameID"],inputs["tradeid"]))

        print(f"Rows affected: {cursor.rowcount}")

        if cursor.rowcount == 0:
            print("No rows were updated - check if trade exists and UUID is correct")

        conn.commit()

        return jsonify(status='ok', msg='status update successful'), 200

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


@trades.route('/trades/completeTrade/' , methods=['POST'])
@jwt_required()
def complete_trade():
    conn = None
    try:
        claims = get_jwt()

        print(f"{claims["gameID"]}")

        inputs = request.get_json()

        conn, cursor = get_cursor()
        cursor.execute("""select *
                        from trades
                        where "traderid" = %s or "tradeeid" = %s
                        """,
                       (claims["gameID"],claims["gameID"]))
        result = cursor.fetchall()

        if (cursor.rowcount != 0):
            cursor.execute("""
                            UPDATE trades
                            SET "status" = 'COMPLETED'
                            where "uuid" = %s
                            """,
                       (inputs['tradeID'],))
            conn.commit()
            return jsonify(status='ok', msg='status update successful'), 200

        else:
            return jsonify(status='error', msg='unauthorised'), 400

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
        