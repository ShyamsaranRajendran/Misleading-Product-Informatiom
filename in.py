import requests
from bs4 import BeautifulSoup

def remove_scripts_and_styles(soup):
    # Remove script tags
    for script in soup(['script', 'style']):
        script.extract()

def scrape_website(url):
    response = requests.get(url)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        remove_scripts_and_styles(soup)
        text_content = ' '.join(soup.stripped_strings)
        print(text_content)
    else:
        print(f"Failed to retrieve the webpage. Status code: {response.status_code}")

website_url = 'https://www.amazon.com/dp/B0B8QC25SP?ref=emc_p_m_5_i_n&th=1'
scrape_website(website_url)
