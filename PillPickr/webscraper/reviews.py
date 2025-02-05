import os
import shutil
import requests
from bs4 import BeautifulSoup
import codecs
import re
from datetime import datetime

class Reviews:
    def __init__(self, link, name):
        self.__link = link
        self.__name = name

    def buildReviews(self):
        filename = self.__name + ".txt"
        # Open the file for appending with UTF-8 encoding
        with codecs.open(filename, "a", encoding="utf-8") as c:
            # Fetch the webpage
            page = requests.get(self.__link)
            soup = BeautifulSoup(page.content, 'html.parser')

            # Process review paragraphs
            reviews = soup.find_all('p', class_="ddc-comment-content")
            for review in reviews:
                text = (str(review)
                        .replace('<p class="ddc-comment-content">', "")
                        .replace("</p>", "")
                        .replace("<b>", "")
                        .replace("</b>", "")
                        .replace("			", " "))
                c.write(text + "\n")

            # Process scores for categories
            scores = soup.select("td.rating-score")
            for score in scores:
                score_text = str(score).replace('<td class="rating-score">', "").replace("</td>", "")
                c.write(score_text + "\n")

            # Process category names
            categories = soup.find_all(scope="row")
            for cat in categories:
                curr = re.sub(r'<span[^>]+>', '', str(cat))
                curr = (curr.replace("</span>", "")
                             .replace("</th>", "")
                             .replace("<th>", "")
                             .replace('<th scope="row">', "")
                             .replace("Off-label", ""))
                c.write(curr + "\n")

            # Process overall score
            overall_elements = soup.find_all(colspan="2")
            print("Found", len(overall_elements), "elements with colspan='2'")
            if len(overall_elements) >= 2:
                overall_score = overall_elements[-2]
                overall_text = str(overall_score).replace('<td colspan="2">', "").replace("</td>", "")
                c.write(overall_text + "\n")
            else:
                print("Not enough elements to retrieve the overall score.")

        # After writing, move the file to the destination folder
        destination_folder = 'minipills'
        destination_path = os.path.join(destination_folder, filename)

        # Option 1: Overwrite existing file:
        if os.path.exists(destination_path):
            os.remove(destination_path)
        # Option 2 (alternative): To rename instead of overwriting, use:
        # if os.path.exists(destination_path):
        #     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        #     new_filename = f"{self.__name}_{timestamp}.txt"
        #     destination_path = os.path.join(destination_folder, new_filename)
        # shutil.move(filename, destination_path)

        shutil.move(filename, destination_folder)

# Example usage:
# review_instance = Reviews("http://example.com/reviewpage", "ortho micronor")
# review_instance.buildReviews()
