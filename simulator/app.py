from random import uniform
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/temperature')
def temperature():
    return jsonify({ "value": round(uniform(20.0, 30.0), 1) })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)