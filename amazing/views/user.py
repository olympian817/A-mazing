from flask.ext.classy import FlaskView
from flask import jsonify
from flask import request

from amazing.lib.database import db
from amazing.models.user import User

from werkzeug.exceptions import NotFound


class UserView(RestView):
    Model = User