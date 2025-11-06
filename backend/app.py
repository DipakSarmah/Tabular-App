import os
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, Record
from sqlalchemy import text

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # db configuration
    DB_USER = os.getenv('MYSQL_USER')
    DB_PASS = os.getenv('MYSQL_PASSWORD')
    DB_HOST = os.getenv('MYSQL_HOST')
    DB_NAME = os.getenv('MYSQL_DB')
    DB_PORT = os.getenv('MYSQL_PORT')

    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    #making database connections
    with app.app_context():
        try:
            db.session.execute(text('SELECT 1'))
            print(f'Connected to MySQL on {DB_HOST}:{DB_PORT} → Database: {DB_NAME}')
        except Exception as e:
            print('Database connection failed:', e)


    # ------------- routes starts here----------------

    @app.route('/api/meta')
    def get_meta():
        return jsonify({
            'header': 'Tabular App - DataGrid Demo (React + Flask)',
            'footer': '© 2025 Example Corp | All rights reserved'
        })

    @app.route('/api/data', methods=['GET'])
    def get_all():
        records = Record.query.all()
        return jsonify([r.to_dict() for r in records])

    @app.route('/api/data', methods=['POST'])
    def create_record():
        data = request.json
        if not data:
            abort(400, 'Invalid JSON')
        record = Record(**{f'col{i}': data.get(f'col{i}', '') for i in range(1, 11)})
        db.session.add(record)
        db.session.commit()
        return jsonify(record.to_dict()), 201

    @app.route('/api/data/<int:record_id>', methods=['PUT'])
    def update_record(record_id):
        data = request.json
        record = Record.query.get_or_404(record_id)
        for i in range(1, 11):
            key = f'col{i}'
            if key in data:
                setattr(record, key, data[key])
        db.session.commit()
        return jsonify(record.to_dict())

    @app.route('/api/data/<int:record_id>', methods=['DELETE'])
    def delete_record(record_id):
        record = Record.query.get_or_404(record_id)
        db.session.delete(record)
        db.session.commit()
        return jsonify({'message': 'deleted'})

    return app


# --- running flask app directly ---
if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
