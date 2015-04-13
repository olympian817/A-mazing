from amazing.models.board import Board
from amazing.models.board import Square
from flask.ext.classy import FlaskView
from flask import jsonify
from flask import request
from amazing.lib.database import db


class BoardView(FlaskView):
    def index(self):
        boards = db.session.query(Board).all()
        board_dicts = []
        for board in boards:
            board_dicts.append(dict(
            name=board.name,
            id=board.id,
            width=board.width,
            height=board.height
            ))
        return jsonify(data=board_dicts)

    def post(self):
        board = Board(**request.json)
        db.session.add(board)
        db.session.commit()
        for i in range(0, board.width):
            for j in range(0, board.height):
                square = Square(board_id=board.id, x=i, y=j)
                db.session.add(square)
        db.session.commit()
        return jsonify(id=board.id, width=board.width, height=board.height)

    def get(self, id):
        board = db.session.query(Board).filter(Board.id==id).first()
        if not board:
            raise NotFound
        return jsonify(id=board.id, width=board.width, height=board.height)
        
    def delete(self, id):
        board = db.session.query(Board).filter(Board.id==id).first()
        if not board:
            raise NotFound
        db.session.delete(board)
        db.session.commit()
        return jsonify()
        

class SquareView(FlaskView):
    def index(self):
        board_id = request.args.get('board_id')
        squares = db.session.query(Square)

        if board_id:
            squares = squares.filter(Square.board_id == board_id)

        squares = squares.all()
        square_dicts = []

        for square in squares:
            square_dicts.append(square.get_dictionary())
        return jsonify(data=square_dicts)
      
    def put(self, square_id):
        square = db.session.query(Square).filter(Square.id==square_id).first()
        if not square:
            raise NotFound

        square.up = request.json.get('up')
        square.down = request.json.get('down')
        square.left = request.json.get('left')
        square.right = request.json.get('right')

        db.session.add(square)
        db.session.commit()
        return jsonify(**square.get_dictionary())