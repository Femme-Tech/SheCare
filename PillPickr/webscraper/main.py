from flask import Flask, jsonify
from webscraper.overview import Overview
from webscraper.interactions import Interactions
from webscraper.reviews import Reviews

app = Flask(__name__)

@app.route("/")
def home():
    return "Welcome to the Drug Info API"

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
