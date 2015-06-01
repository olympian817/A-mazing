from amazing.models.game import Game
from amazing.views.base import RestView


class GameView(RestView):
    Model = Game