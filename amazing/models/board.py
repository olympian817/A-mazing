from amazing.lib.database import db


class Board(db.Model):
	__tablename__ = 'board'
	id = db.Column(db.Integer, primary_key=True)
	width = db.Column(db.Integer, nullable=False)
	height = db.Column(db.Integer, nullable=False)


class Square(db.Model):
	__tablename__ = 'square'
	id = db.Column(db.Integer, primary_key=True)
	board_id = db.Column(db.Integer, db.ForeignKey('board.id'), nullable=False)
	left = db.Column(db.Boolean, nullable=False, default=False)
	right = db.Column(db.Boolean, nullable=False, default=False)
	up = db.Column(db.Boolean, nullable=False, default=False)
	down = db.Column(db.Boolean, nullable=False, default=False)
	x = db.Column(db.Integer, nullable=False)
	y = db.Column(db.Integer, nullable=False)