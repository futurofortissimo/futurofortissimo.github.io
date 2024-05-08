import requests
from bs4 import BeautifulSoup
import json

def scrape_links_from_url(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Concatenate all paragraph texts
        texts = ' '.join([paragraph.text for paragraph in soup.find_all('p')])

        # Extract <h4> texts, direct text after them, and their corresponding section links and images
        h4_sections = []
        for h4 in soup.find_all('h4', class_='header-with-anchor-widget'):
            section = {'text': h4.get_text(strip=True), 'direct_text': '', 'citations': []}

            # Find direct sibling elements for direct text and citations
            for sibling in h4.find_next_siblings():
                if sibling.name == 'p' or sibling.name == 'div':
                    section['direct_text'] += ' ' + sibling.get_text(strip=True)
                    # Extract links and images within this sibling
                    links = sibling.find_all('a', href=True)
                    imgs = sibling.find_all('img', src=True)
                    for link in links:
                        section['citations'].append({'type': 'link', 'href': link['href'], 'text': link.get_text(strip=True)})
                    for img in imgs:
                        caption = img.get('alt', 'No caption')
                        section['citations'].append({'type': 'image', 'src': img['src'], 'caption': caption})
                else:
                    # Stop if we hit another header or an element type that typically signifies a new section
                    break

            h4_sections.append(section)

        return {
            "title": soup.title.text if soup.title else "No title found",
            "link": url,
            "texts": texts,
            "h4_sections": h4_sections
        }
    except requests.exceptions.RequestException as e:
        print(f"Request error for {url}: {e}")
        return None
    except Exception as e:
        print(f"Error processing {url}: {e}")
        return None
def main():
    # Simulate reading from 'links.txt'
    links_content = """
"🎼 ff.92 La dieta dei centenari?","https://fortissimo.substack.com/p/ff92-la-dieta-dei-centenari"
    """.strip().splitlines()

    scraped_links = []

    for line in links_content:
        # Extract URL from each line
        title, url = line.strip('"').split('","')
        if "ff." not in url:
            scraped_data = scrape_links_from_url(url)
            print(url)
            if scraped_data:
                scraped_links.append(scraped_data)

    # Assuming you would save this in your local environment
    # Save the scraped data with UTF-8 encoding
    with open('scraped_links_2.json', 'w', encoding='utf-8') as file:
        json.dump(scraped_links, file, ensure_ascii=False, indent=4)
if __name__ == "__main__":
    main()
