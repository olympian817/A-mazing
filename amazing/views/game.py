from amazing.models.game import Game
from flask.ext.classy import FlaskView
from flask import jsonify
from flask import request
from amazing.lib.database import db

class GameView(FlaskView):
    def index(self):
        games = db.session.query(Game).all()
        game_dicts = []
        for game in games:
            game_dicts.append(dict(
                name=game.name,
                id=game.id,
                owner_id=game.owner_id,
                guest_id=game.guest_id
                ))
        return jsonify(game_data=game_dicts)

    def get(self, id):
        game = db.session.query(Game).filter(Game.id==id).first()
        if not game:
            raise NotFound

        return jsonify(name=game.name, id=game.id, owner_id=game.owner_id, guest_id=game.guest_id)

    def post(self):
        game = Game(name=request.json.get('name'), owner_id=request.json.get('owner_id'))
        db.session.add(game)
        db.session.commit()
        return self.get(game.id), 201

    def delete(self, id):
        game = db.session.query(Game).filter(Game.id==id).first()
        if not game:
            raise NotFound
        db.session.delete(game)
        db.session.commit()
        return jsonify(), 204