from flask.ext.classy import FlaskView
from flask import jsonify
from flask import request

from amazing.lib.database import db
from amazing.models.user import User

from werkzeug.exceptions import NotFound


class UserView(FlaskView):
    def index(self):
        users = db.session.query(User).all()
        user_dicts = []
        for user in users:
            user_dicts.append(dict(name=user.name, id=user.id))
        return jsonify(data=user_dicts)
    def get(self, id):
        user = db.session.query(User).filter(User.id==id).first()
        if not user:
            raise NotFound
        return jsonify(name=user.name, id=user.id)
    def post(self):
        user = User(name=request.json.get('name'))
        db.session.add(user)
        db.session.commit()
        return self.get(user.id)
    def delete(self, id):
        user = db.session.query(User).filter(User.id==id).first()
        if not user:
            raise NotFound
        db.session.delete(user)
        db.session.commit()
        return jsonify()
    def put(self, id):
        user = db.session.query(User).filter(User.id==id).first()
        if not user:
            raise NotFound
        user.name = request.json.get('name')
        db.session.add(user)
        db.session.commit()
        return self.get(id)