from app import create_app
from models import db, Record

app = create_app()

number = 101
with app.app_context():
    db.create_all()
    if Record.query.count() == 0:
        for i in range(1, number):
            r = Record(**{f'col{j}': f'Row{i}-C{j}' for j in range(1, 11)})
            db.session.add(r)
        db.session.commit()
        print(f'Seeded {number} rows successfully')
    else:
        print('Table already has data, skipping seeding')
