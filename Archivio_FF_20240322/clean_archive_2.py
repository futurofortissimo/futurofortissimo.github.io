import requests
from bs4 import BeautifulSoup
import json

def scrape_links_from_url(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Concatenate all paragraph texts
        texts = ' '.join([paragraph.text for paragraph in soup.find_all('p')])

        # Extract <h4> texts and associated information
        h4_sections = []
        for h4 in soup.find_all('h4', class_='header-with-anchor-widget'):
            section = {'text': h4.get_text(strip=True), 'direct_text': '', 'citations': []}

            sibling = h4.find_next_sibling()
            while sibling and not sibling.name.startswith('h'):
                if sibling.name in ['p', 'div']:
                    section['direct_text'] += ' ' + sibling.get_text(strip=True)
                    links = sibling.find_all('a', href=True)
                    imgs = sibling.find_all('img', src=True)
                    for link in links:
                        section['citations'].append({'type': 'link', 'href': link['href'], 'text': link.get_text(strip=True)})
                    for img in imgs:
                        caption = img.get('alt', 'No caption')
                        section['citations'].append({'type': 'image', 'src': img['src'], 'caption': caption})
                sibling = sibling.find_next_sibling()

            h4_sections.append(section)

        # Additional section for divs with specific href pattern
        special_divs = []
        for div in soup.find_all('div', href=True):
            href = div['href']
            if "https://fortissimo.substack.com/i/" in href:
                special_divs.append({
                    'type': 'link',
                    'href': href,
                    'text': div.get_text(strip=True)
                })

        return {
            "title": soup.title.text if soup.title else "No title found",
            "link": url,
            "texts": texts,
            "h4_sections": h4_sections,
            "special_divs": special_divs  # Special divs section
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
        title, url = line.strip('"').split('","')
        scraped_data = scrape_links_from_url(url)
        if scraped_data:
            scraped_links.append(scraped_data)

    # Save the scraped data with UTF-8 encoding
    with open(line.split(' ')[1].split(' ')[0]+'_parsed.json', 'w', encoding='utf-8') as file:
        json.dump(scraped_links, file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()
