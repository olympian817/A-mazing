from amazing.models.board import Board
from amazing.models.board import Square
from amazing.views.base import RestView


class BoardView(RestView):
    Model = Board
        

class SquareView(FlaskView):
    Model = Square