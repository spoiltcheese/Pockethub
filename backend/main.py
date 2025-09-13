import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from resources.cards import cards
from resources.auth import auth
from resources.trades import trades
from flask_jwt_extended import JWTManager
from db.db_pool import get_cursor, release_connection
app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
JWTManager(app)
app.register_blueprint(cards, url_prefix='/api')
app.register_blueprint(trades, url_prefix='/api')
app.register_blueprint(auth, url_prefix='/auth')

if __name__ == '__main__':
    app.run(port=5001, debug=os.getenv('DEBUG', False))