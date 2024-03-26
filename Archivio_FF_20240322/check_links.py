import csv
import requests

csv_file = '../index_files/notes_ff_michele_merelli_2024_futuro_fortissimo.csv'

import csv
import requests
from urllib.parse import urlparse

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

def check_links(csv_file):
    with open(csv_file, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            try:
                link = row[2]
                if not is_valid_url(link):
                    print(f"Skipping invalid URL: {link}")
                    continue
                try:
                    response = requests.head(link)
                    if response.status_code == 200:
                        print(f"Link {link} is valid.")
                    else:
                        print(f"Link {link} returned status code {response.status_code}. Page not found?")
                except requests.ConnectionError:
                    print(f"Link {link} could not be loaded. Connection error occurred.")
            except:
                print('probably not a valid line')

if __name__ == "__main__":
    csv_file = csv_file  # Assicurati di sostituire con il nome effettivo del tuo file CSV
    check_links(csv_file)
