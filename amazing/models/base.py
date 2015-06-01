from sqlalchemy.ext.declarative import declaredattr

class ModelMixin(object):

	@declaredattr
	def __tablename__(cls):
		return cls.__name__.lower()

	def __str__(self):
		return '<{} id={}>'.format(self.__class__.__name__, self.id_)

	id_ = db.Column('id', db.Integer, primary_key=True)

	def get_dictionary(self):
		d = {}
		for column in self.__table__.columns:
			d[column.key] = getattr(self, column.key)

		return d