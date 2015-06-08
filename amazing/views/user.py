from amazing.views.base import RestView
from amazing.models.user import User


class UserView(RestView):
    Model = User