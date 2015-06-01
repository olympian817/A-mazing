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
		model = self.Model(**request.json)
		db.session.add(model)
		db.session.commit()
		return self.json(model.get_dictionary())

	def put(self, id_):
		model = db.session.query(self.Model).filter(self.Model.id_==id_).first()
		if not model:
			raise NotFound
		model.update(request.json)
		db.session.add(model)
		db.session.commit()
		return self.json(model.get_dictionary())

	def delete(self, id_):
		model = db.session.query(self.Model).filter(self.Model.id_==id_).first()
		