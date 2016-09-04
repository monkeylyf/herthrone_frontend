import json
import os
import time
from flask import Flask, Response, request

app = Flask(__name__, static_url_path='', static_folder='./src')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))


@app.route('/api/heroes', methods=['GET'])
def heroes():
    """"""
    # TODO: Hook up with rpc client to get the real hero list.
    heroes = [
        'Anduin Wrynn',
        'Gul\'dan',
        'Jaina Proudmoore',
        'Malfurion Stormrage',
        'Rexxar',
        'Thrall',
        'Uther Lightbringer',
        'Valeera Sanguinar',
        'Garrosh Hellscream'
    ]
    return Response(
        json.dumps(heroes),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )

@app.route('/api/cards', methods=['POST'])
def cards():
    """"""
    payload = request.get_json(force=True)
    hero = payload.get('hero')
    if hero:
        # TODO: Hook up with rpc client to get the real cards.
        cards = [hero + ' card #' + str(i) for i in xrange(10)]
    else:
        cards = []

    return Response(
        json.dumps(cards),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


if __name__ == '__main__':
    app.run(port=3000)
