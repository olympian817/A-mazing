from amazing.models.board import Board
from amazing.models.board import Square
from flask.ext.classy import FlaskView
from flask import jsonify
from flask import request
from amazing.lib.database import db


class BoardView(FlaskView):
    def index(self):
        board = db.session.query(Board).all()
        board_dicts = []
        for e in board:
            board_dicts.append(dict(
            id=board.id,
            width=board.width,
            height=board.height
            ))
        return jsonify(data=board_dicts)

    def post(self):
        board = Board(**request.json)
        db.session.add(board)
        db.session.commit()
        for i in range(0, Board.width):
            for j in range(0, Board.height):
                square = Square(board_id=board.id, x=i, y=j)
                db.session.add(square)
        db.session.commit()
        return jsonify(id=board.id, width=board.width, height=board.height)

    def get(self, id):
        board = db.session.query(Board).filter(Board.id==id).first()
        if not board:
            raise NotFound
        return jsonify(id=board.id, width=board.width, height=board.height)
        

class SquareView(FlaskView):
    def index(self):
        board_id = request.GET.get('board_id')
        squares = db.session.query(Square)

        if board_id:
            squares = squares.filter(Square.board_id == board_id)

        squares = squares.all()
        square_dicts = []

        for square in squares:
            square_dicts.append(dict(
                id=square.id,
                board_id=square.board_id,
                left=square.left,
                right=square.right,
                up=square.up,
                down=square.down,
                x=square.x,
                y=square.y
                ))
        return jsonify(data=square_dicts)

    def put(self, square_id):
        square = db.session.query(Square.id==square_id)
        Square.up = (request.json.get('up') == 'true')
        Square.down = (request.json.get('down') == 'true')
        Square.left = (request.json.get('left') == 'true')
        Square.right = (request.json.get('right') == 'true')
        return jsonify(up=square.up, down=square.down, right=square.right, left=square.left)





