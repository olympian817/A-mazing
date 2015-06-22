from amazing.views.base import RestView, View
from amazing.models.user import User
from flask import session, request
from werkzeug.exceptions import Unauthorized


class UserView(RestView):
    Model = User

class SessionView(View):
    def index(self):
        return self.json(session.get_dictionary())

    def post(self):
        user = db.session.query(User).filter(User.name == request.GET.get('name')).first()

        if not user:
            raise Unauthorized

        if not check_password(user):
            raise Unauthorized

        session.clear()
        session['user_id'] = user.id_
        return self.json(session.get_dictionary(), 201)

    def delete(self):
        session.clear()
        return self.json({}, 204)