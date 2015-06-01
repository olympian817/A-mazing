from flask.ext.classy import FlaskView
from werkzeug.exceptions import NotFound
from flask import jsonify, request
from amazing.lib.database import db


class RestView(FlaskView):
	Model = None

	def json(self, obj, status=200):
		return jsonify(data=obj), status

	def index(self):
		return self.json([
			m.get_dictionary() for m in db.session.query(self.Model).all()])

	def get(self, id_):
        model = db.session.query(self.Model).filter(Board.id==id).first()
        if not model:
        	raise NotFound
        return self.json(model.get_dictionary())

	def post(self):
		

	def put(self, id_):

	def delete(self, id_):