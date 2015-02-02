from amazing.views import user
from amazing.views import game
from amazing.views import board

def register(app):
    user.UserView.register(app, route_base='/user/')
    game.GameView.register(app, route_base='/game/')
    board.BoardView.register(app, route_base='/board/')