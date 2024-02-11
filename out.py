import json
import openai
import requests
from bs4 import BeautifulSoup

openai.api_key = "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"

def remove_scripts_and_styles(soup):
    for script in soup(['script', 'style']):
        script.extract()

def scrape_website(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        remove_scripts_and_styles(soup)
        text_content = ' '.join(soup.stripped_strings)
        return text_content
    else:
        print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
        return None

website_url = 'https://www.amazon.com/dp/B0B8QC25SP?ref=emc_p_m_5_i_n&th=1'
scraped_text = scrape_website(website_url)

if scraped_text:
    prompt = (
        scraped_text
        + "Give the information in the format have shown below  must be in lower case (use array brackets and curly braces to convert to JSON whenever needed and enclose all with square brackets, remove the null fields ) - Product Name: [Product Name] - Brand: [Brand] - Description: [Description] - Color: [Color] - Price: [$ Price] - Rating: [Rating] out of 5 stars ([Number of Ratings] ratings) - Best Sellers Rank: #[Best Sellers Rank] in [Category] - Release Date: [Release Date] - Weight: [Weight] - Connectivity Technology: [Connectivity Technology] - Compatibility: [Compatibility] - Features: { \"1\": [Feature 1] \"2\": [Feature 2] \"3\": [Feature 3] ...} - Special Features: { \"1\": [Special Feature 1] \"2\": [Special Feature 2] \"3\": [Special Feature 3] ...} - Warranty: [Warranty Information] - Reviews: { \"1\": [positive 1] \"2\": [positive 2] \"3\": [positive 3] ...} - Reviews: {negative Reviews}"
    )

    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=450
    )

    chatgpt_response = response['choices'][0]['text']

    # Save the GPT-3 response to a JSON file
    output_file_path = 'Product/products.json'
    with open(output_file_path, 'w') as json_file:
        json.dump(chatgpt_response, json_file, indent=2)

    print(f"GPT-3 response saved to {output_file_path}")
else:
    print("Scraping failed, cannot proceed with GPT-3.")
