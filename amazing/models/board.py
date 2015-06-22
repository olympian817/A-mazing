from amazing.lib.database import db
from amazing.models.base import ModelMixin


class Board(db.Model, ModelMixin):
	name = db.Column(db.Unicode(length=255), nullable=False)
	width = db.Column(db.Integer, nullable=False)
	height = db.Column(db.Integer, nullable=False)


class Square(db.Model, ModelMixin):
	board_id = db.Column(db.Integer, db.ForeignKey('board.id'), nullable=False)
	left = db.Column(db.Boolean, nullable=False, default=False)
	right = db.Column(db.Boolean, nullable=False, default=False)
	up = db.Column(db.Boolean, nullable=False, default=False)
	down = db.Column(db.Boolean, nullable=False, default=False)
	x = db.Column(db.Integer, nullable=False)
	y = db.Column(db.Integer, nullable=False)

	def get_dictionary(self):
		return dict(
            id=self.id,
            board_id=self.board_id,
            left=self.left,
            right=self.right,
            up=self.up,
            down=self.down,
            x=self.x,
            y=self.y
            )