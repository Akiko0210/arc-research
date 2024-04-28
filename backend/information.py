import requests
from bs4 import BeautifulSoup

def scrape_paragraph(url):
    # Send a GET request to the URL
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all paragraph tags containing the information
        paragraphs = soup.find_all('p')
        
        # Extract the text from the paragraphs
        paragraph_texts = [paragraph.text.strip() for paragraph in paragraphs]
        
        # Join the paragraph texts into a single string
        return '\n'.join(paragraph_texts)
    else:
        return "Failed to retrieve page. Status code: " + str(response.status_code)
