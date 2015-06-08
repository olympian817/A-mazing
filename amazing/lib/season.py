from flask.sessions import SecureCookieSession, SecureCookieSessionInterface


class Session(SecureCookieSession):
    @property
    def user(self):
        from amazing.lib.database import db
        from amazing.models.user import User

        return db.session.query(User).filter(User.id_==self.get('user_id')).first()
    
    def get_dictionary(self):
        return {'user_id': self.get('user_id')}

class MazesSessionInferface(SecureCookieSessionInterface):
    session_class = Session