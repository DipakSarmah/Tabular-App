from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy instance
db = SQLAlchemy()

class Record(db.Model):
    """
    Record model represents one row in the 'records' table.
    """
    __tablename__ = 'records'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    col1 = db.Column(db.String(255), nullable=False)
    col2 = db.Column(db.String(255), nullable=False)
    col3 = db.Column(db.String(255), nullable=False)
    col4 = db.Column(db.String(255), nullable=False)
    col5 = db.Column(db.String(255), nullable=False)
    col6 = db.Column(db.String(255), nullable=False)
    col7 = db.Column(db.String(255), nullable=False)
    col8 = db.Column(db.String(255), nullable=False)
    col9 = db.Column(db.String(255), nullable=False)
    col10 = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        """for debugging"""
        return f"<Record id={self.id}>"

    def to_dict(self):
        """model instance will be converted to dictionary (JSON response k liye)."""
        return {
            "id": self.id,
            "col1": self.col1,
            "col2": self.col2,
            "col3": self.col3,
            "col4": self.col4,
            "col5": self.col5,
            "col6": self.col6,
            "col7": self.col7,
            "col8": self.col8,
            "col9": self.col9,
            "col10": self.col10
        }
