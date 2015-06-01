from amazing.lib.base import ModelMixin
from amazing.lib.database import db
import bcrypt


class User(ModelMixin, db.Model):
    name = db.Column(db.Unicode(length=255), nullable=False, unique=True)
    _password = db.Column('password', db.Unicode(length=255), nullable=False)

    @property
    def password(self):
        return self._password
    @password.setter
    def password(self, value):
        self._password = bcrypt.hashpw(value, bcrypt.gensalt())
    def check_password(self, value):
    	return bcrypt.hashpw(value, self._password) == self._password



    