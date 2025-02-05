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
        self.__name = name  # e.g., "ortho micronor"

    def buildReviews(self):
        # Create the output filename
        filename = self.__name + ".txt"
        
        # Open the file for appending with UTF-8 encoding
        with codecs.open(filename, "a", encoding="utf-8") as f:
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
                f.write(text + "\n")

            # Process scores for categories
            scores = soup.select("td.rating-score")
            for score in scores:
                score_text = str(score).replace('<td class="rating-score">', "").replace("</td>", "")
                f.write(score_text + "\n")

            # Process category names
            categories = soup.find_all(scope="row")
            for cat in categories:
                curr = re.sub(r'<span[^>]+>', '', str(cat))
                curr = (curr.replace("</span>", "")
                             .replace("</th>", "")
                             .replace("<th>", "")
                             .replace('<th scope="row">', "")
                             .replace("Off-label", ""))
                f.write(curr + "\n")

            # Process overall score (if any)
            overall_elements = soup.find_all(colspan="2")
            print("Found", len(overall_elements), "elements with colspan='2'")
            if len(overall_elements) >= 2:
                overall_score = overall_elements[-2]
                overall_text = str(overall_score).replace('<td colspan="2">', "").replace("</td>", "")
                f.write(overall_text + "\n")
            else:
                print("Not enough elements to retrieve the overall score.")

        # Now move the generated file into the 'minipills' folder.
        destination_folder = 'minipills'
        # Ensure the destination folder exists
        if not os.path.exists(destination_folder):
            os.makedirs(destination_folder)
            
        destination_path = os.path.join(destination_folder, filename)

        # If a file with the same name already exists, rename the file by appending a timestamp.
        if os.path.exists(destination_path):
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            new_filename = f"{self.__name}_{timestamp}.txt"
            destination_path = os.path.join(destination_folder, new_filename)
            print(f"File already exists. Renaming file to: {new_filename}")

        # Move the file to the destination folder.
        try:
            shutil.move(filename, destination_path)
            print(f"File moved to {destination_path}")
        except shutil.Error as e:
            print(f"Error moving file: {e}")

# Example usage:
# Replace the URL below with the actual URL you want to scrape.
if __name__ == "__main__":
    url = "http://example.com/reviewpage"  # Change this to your target URL
    review_instance = Reviews(url, "ortho micronor")
    review_instance.buildReviews()
