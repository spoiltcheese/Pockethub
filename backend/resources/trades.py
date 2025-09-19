from flask import request, jsonify, Blueprint
from db.db_pool import get_cursor, release_connection
from marshmallow import ValidationError
from validators.tools import AddOneToolsSchema
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

import psycopg2


#stretch goal: casting is hackish and has a performance penalty, but refactoring it will require a refactor of the database..
trades= Blueprint('trades', __name__)
@trades.route('/trades')
# @jwt_required()
def find_all_trades():
    conn = None
    try:
        conn, cursor = get_cursor()
        cursor.execute("""select DISTINCT
                        c1."cardname" as lookingfor,
                        c2."cardname" as tradingwith,
                        u."gameid" as "traderID",
                        u."name" as "traderName",
                        m1.uri as "LFURI",
                        m2.uri as "TWURI",
                        t."uuid" as "uuid"
                        from "trades" t
                        join cards c1 on c1.cardnumber = t."lookingforID"
                        join cards c2 on c2.cardnumber = t."tradingwithID"
                        join "auth" u on u."gameid" = t."traderID"
                        join "media" m1 on m1."id"::VARCHAR = t."lookingforID"
                        join "media" m2 on m2."id"::VARCHAR = t."tradingwithID"
                        where status = 'PENDING'
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
                        select DISTINCT
                        c1."cardname" as lookingfor,
                        c2."cardname" as tradingwith,
                        u."gameid" as "traderID",
                        u."name" as "traderName",
                        m1.uri as "LFURI",
                        m2.uri as "TWURI",
                        t."uuid" as "uuid"
                        from "trades" t
                        join cards c1 on c1.cardnumber = t."lookingforID"
                        join cards c2 on c2.cardnumber = t."tradingwithID"
                        join "auth" u on u."gameid" = t."traderID"
                        join "media" m1 on m1."id"::VARCHAR = t."lookingforID"
                        join "media" m2 on m2."id"::VARCHAR = t."tradingwithID"
                        where "traderID" = %s
                        """,
                       (inputs['gameID'],))
        result = cursor.fetchall()

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

@trades.route('/addTrade', methods=['POST'])
def add_trade():
    conn = None
    try:
        conn, cursor = get_cursor()
        inputs = request.get_json()

        required_fields = ['lookingfor', 'tradingwith', 'traderID', 'LFID', 'TWID']
        missing_fields = [field for field in required_fields if field not in inputs]

        if missing_fields:
            return jsonify(status='error', msg=f'Missing required fields: {missing_fields}'), 400

        cursor.execute(
            """
            SELECT "uuid" FROM "auth" WHERE "gameid" = %s
            """,
            (inputs['traderID'],)
        )

        trader_result = cursor.fetchone()



        if not trader_result:

            return jsonify(status='error', msg='Invalid traderID'), 400

        trader_uuid = trader_result['uuid']


        if not trader_result:
            return jsonify(status='error', msg='Invalid traderID'), 400

        cursor.execute(
            """
            INSERT INTO trades ("lookingfor", "tradingwith", "traderID", "traderUUID", "lookingforID", "tradingwithID") VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (inputs['lookingfor'], inputs['tradingwith'], inputs['traderID'], trader_uuid, inputs['LFID'], inputs['TWID']))

        conn.commit()

        return jsonify(status='ok', msg='addition successful'), 200

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

@trades.route('/trades/<trade_id>')
# @jwt_required()
def find_single_trades(trade_id):
    conn = None
    try:
        conn, cursor = get_cursor()

        cursor.execute("""                        
                        select DISTINCT
                        c1."cardname" as lookingfor,
                        c2."cardname" as tradingwith,
                        u."gameid" as "traderID",
                        u."name" as "traderName",
                        m1.uri as "LFURI",
                        m2.uri as "TWURI",
                        t."uuid" as "uuid"
                        from "trades" t
                        join cards c1 on c1.cardnumber = t."lookingforID"
                        join cards c2 on c2.cardnumber = t."tradingwithID"
                        join "auth" u on u."gameid" = t."traderID"
                        join "media" m1 on m1."id"::VARCHAR = t."lookingforID"
                        join "media" m2 on m2."id"::VARCHAR = t."tradingwithID"
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

        cursor.execute("""
                        select DISTINCT
                        c1."cardname" as lookingfor,
                        c2."cardname" as tradingwith,
                        u."gameid" as "traderID",
                        u."name" as "traderName",
                        m1.uri as "LFURI",
                        m2.uri as "TWURI",
                        t."uuid" as "uuid"
                        from "trades" t
                        join cards c1 on c1.cardnumber = t."lookingforID"
                        join cards c2 on c2.cardnumber = t."tradingwithID"
                        join "auth" u on u."gameid" = t."traderID"
                        join "media" m1 on m1."id"::VARCHAR = t."lookingforID"
                        join "media" m2 on m2."id"::VARCHAR = t."tradingwithID"
                        where t."uuid" = %s
                        """,
                       (inputs['gameID'],))
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

        cursor.execute(
            "SELECT uuid FROM auth WHERE gameid = %s",
            (claims["gameID"],)
        )
        tradee_result = cursor.fetchone()

        if not tradee_result:

            return jsonify(status='error', msg='Invalid traderID'), 400

        tradee_uuid = tradee_result['uuid']

        cursor.execute(
            """
            SELECT "traderUUID" FROM trades WHERE "traderUUID" = %s
            """,
            (tradee_uuid,)
        )
        trader_result = cursor.fetchone()

        if trader_result:

            return jsonify(status='error', msg='cannot trade with yourself!'), 400



        cursor.execute("""
                        UPDATE trades
                        SET "status" = 'ACCEPTED', "tradeeID" = %s, "tradeeUUID" = %s
                        where "uuid" = %s
                        """,
                       (claims["gameID"], tradee_uuid, inputs["tradeID"]))


        conn.commit()

        return jsonify(status='ok', msg='status update successful'), 200

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


@trades.route('/trades/completeTrade' , methods=['POST'])
@jwt_required()
def complete_trade():
    conn = None
    try:
        claims = get_jwt()



        inputs = request.get_json()

        conn, cursor = get_cursor()
        cursor.execute("""select *
                        from trades
                        where "traderID" = %s or "tradeeID" = %s
                        """,
                       (claims["gameID"],claims["gameID"]))
        result = cursor.fetchall()

        if (cursor.rowcount != 0):
            cursor.execute("""
                            UPDATE trades
                            SET "status" = 'COMPLETED'
                            WHERE "uuid" = %s
                            """,
                       (inputs['tradeID'],))
            conn.commit()
            return jsonify(status='ok', msg='status update successful'), 200

        else:
            return jsonify(status='error', msg='unauthorised'), 400

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
        