from flask import request, jsonify, Blueprint
from db.db_pool import get_cursor, release_connection
from marshmallow import ValidationError
from validators.tools import AddOneToolsSchema
from flask_jwt_extended import jwt_required

import psycopg2

trades= Blueprint('trades', __name__)
@trades.route('/trades')
# @jwt_required()
def find_all_trades():
    conn = None
    try:
        conn, cursor = get_cursor()
        cursor.execute("""select DISTINCT
                        c1."cardname" as lookingfor_cardname,
                        c2."cardname" as tradingwith_cardname,
                        u."traderID" as "traderID",
                        u."traderName" as "traderName"
                        from "tradesTest" t
                        join cards c1 on c1.cardnumber = t.lookingfor
                        join cards c2 on c2.cardnumber = t.tradingwith
                        join "usersTest" u on u."traderID" = t."traderID"
                        """)
        result = cursor.fetchall()

        return jsonify(result), 200

    except SyntaxError as err:
        return jsonify({'status': 'error'}), 400

    except Exception as err:
        return jsonify({'status': 'error'}), 400


    finally:
        release_connection(conn)