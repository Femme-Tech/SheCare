from flask import Flask, jsonify, render_template
from webscraper.overview import Overview
from webscraper.interactions import Interactions
from webscraper.reviews import Reviews

app = Flask(__name__, template_folder="templates") 
app = Flask(__name__, static_folder="static")

@app.route("/")
def home():
    return render_template("index.html")
@app.route('/survey', endpoint='survey')
def survey():
    return render_template('survey.html')
@app.route('/minipill', endpoint='minipill')
def minipill():
    return render_template('minipill.html')

@app.route('/previfem', endpoint='previfem')
def previfem():
    return render_template('previfem.html')

@app.route('/alesse', endpoint='alesse')
def alesse():
    return render_template('alesse.html')

@app.route('/beyaz', endpoint='beyaz')
def beyaz():
    return render_template('beyaz.html')

@app.route('/gianvi', endpoint='gianvi')
def gianvi():
    return render_template('gianvi.html')

@app.route('/ocella', endpoint='ocella')
def ocella():
    return render_template('ocella.html')

@app.route('/seasonique', endpoint='seasonique')
def seasonique():
    return render_template('seasonique.html')

@app.route('/seasonale', endpoint='seasonale')
def seasonale():
    return render_template('seasonale.html')

@app.route('/velivet', endpoint='velivet')
def velivet():
    return render_template('velivet.html')

@app.route('/apri', endpoint='apri')
def apri():
    return render_template('apri.html')

@app.route('/lybrel', endpoint='lybrel')
def lybrel():
    return render_template('lybrel.html')
@app.route("/scrape")
def scrape():
    name = "ortho micronor"

    drugOverview = Overview("https://www.drugs.com/mtm/ortho-micronor.html", name)
    drugOverview.buildOverview()

    drugInteraction = Interactions("https://www.drugs.com/drug-interactions/norethindrone,ortho-micronor.html", name)
    drugInteraction.buildInteractions()

    drugReviews = Reviews("https://www.drugs.com/comments/norethindrone/ortho-micronor.html", name)
    drugReviews.buildReviews()

    return jsonify({"message": "Scraping completed successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
