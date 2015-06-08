from amazing.lib.database import db
from amazing.models.user import User

class Game(db.Model):
    __tablename__ = 'game'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode(length=255), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    guest_id = db.Column(db.Integer, db.ForeignKey('user.id'))