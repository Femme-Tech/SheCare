import requests 
from bs4 import BeautifulSoup
import codecs
import re
class Reviews:
    def __init__(self,link,name):
        self.__link = link
        self.__name = name
   def buildReviews(self):
    # Open file for appending with UTF-8 encoding
    c = codecs.open(self.__name + ".txt", "a", encoding="utf-8")
    
    # Request the page
    page = requests.get(self.__link)
    soup = BeautifulSoup(page.content, 'html.parser')
    
    # Process reviews
    reviews = soup.find_all('p', class_="ddc-comment-content")
    for review in reviews:
        text = (str(review)
                .replace('<p class="ddc-comment-content">', "")
                .replace("</p>", "")
                .replace("</b>", "")
                .replace("<b>", "")
                .replace("			", " "))
        c.write(text + "\n")
    
    # Process scores for categories
    scores = soup.select("td.rating-score")
    for score in scores:
        c.write(str(score).replace('<td class="rating-score">', "").replace("</td>", "") + "\n")
    
    # Process categories
    categories = soup.find_all(scope="row")
    for cat in categories:
        curr = re.sub(r'<span[^>]+>', '', str(cat))
        curr = curr.replace("</span>", "").replace("</th>", "").replace("<th>", "").replace('<th scope="row">', "").replace("Off-label", "")
        c.write(curr + "\n")
    
    # Process overall score
    overall_elements = soup.find_all(colspan="2")
    # Debug print: show how many elements were found
    print("Found", len(overall_elements), "elements with colspan='2'")
    
    # Check if we have enough elements to safely access [-2]
    if len(overall_elements) >= 2:
        overall_score = overall_elements[-2]
        c.write(str(overall_score).replace('<td colspan="2">', "").replace("</td>", "") + "\n")
    else:
        print("Not enough elements to retrieve the overall score.")
    
    c.close()


