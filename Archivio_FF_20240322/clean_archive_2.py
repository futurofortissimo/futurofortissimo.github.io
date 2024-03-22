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
"🎼 ff.88 Singolarità nel 2029?","https://fortissimo.substack.com/p/ff88-singolarita-nel-2029"
"🎼 ff.87 Siamo quello che respiriamo","https://fortissimo.substack.com/p/ff87-siamo-quello-che-respiriamo"
"🎼 ff.86 Bruciare ossigeno è vita","https://fortissimo.substack.com/p/ff85-bruciare-ossigeno-e-vita"
"🎼 ff.85 Mangiare carbonara nel metaverso","https://fortissimo.substack.com/p/ff85-mangiare-carbonara-nel-metaverso"
"🎼 ff.84 CES: fiera dell'artigianato tech","https://fortissimo.substack.com/p/ff84-ces-fiera-dellartigianato-tech"
"🎼 ff.83 Imparare da ChatGPT","https://fortissimo.substack.com/p/ff83-imparare-da-chatgpt"
"🎼 ff.82 Guerra a colpi di chip","https://fortissimo.substack.com/p/ff81-guerra-a-colpi-di-chip"
"🎼 ff.81 Il 2024 nei libri di storia","https://fortissimo.substack.com/p/ff81-il-2024-nei-libri-di-storia"
"🎼 ff.80 Il meglio di ff.2023","https://fortissimo.substack.com/p/ff80-il-meglio-di-ff2023"
"🎼 ff.79 Natale spacchettato","https://fortissimo.substack.com/p/ff79-natale-spacchettato"
"🎼 ff.78 Psicologo digitale","https://fortissimo.substack.com/p/ff78-psicologo-digitale"
"🎼 ff.77 Famiglia cercasi","https://fortissimo.substack.com/p/ff77-famiglia-cercasi"
"🎼 ff.76 Siamo ancora in lockdown?","https://fortissimo.substack.com/p/ff76-quello-che-resta-del-lockdown"
"🎼 Due anni fortissimi!","https://fortissimo.substack.com/p/due-anni-fortissimi"
"🎼 ff.75 Massaggi al cervello","https://fortissimo.substack.com/p/ff75-massaggi-al-cervello"
"🎼 ff.74 Sono giapponese!","https://fortissimo.substack.com/p/ff74-made-in-japan"
"🎼 ff.73 Futuro criptato","https://fortissimo.substack.com/p/ff72-criptico"
"🎼 ff.72 Giochiamo a UNO?","https://fortissimo.substack.com/p/ff71-giochiamo-a-uno"
"🎼 ff.71 ChatGPT ti vede","https://fortissimo.substack.com/p/ff71-chatgpt-ti-vede"
"🎼 ff.70 Il sole: soluzione o morte?","https://fortissimo.substack.com/p/ff70-il-sole-soluzione-o-morte"
"🎼 ff.69 Quantico?","https://fortissimo.substack.com/p/ff69-quantico"
"🎼 ff.68 Che ansia! (pt. 2)","https://fortissimo.substack.com/p/ff68-che-ansia-pt-2"
"🎼 ff Sogno di mezz'estate","https://fortissimo.substack.com/p/ff-sogno-di-mezzestate"
"🎼 ff.67 L'estate sta iniziando","https://fortissimo.substack.com/p/ff67-lestate-sta-iniziando"
"🎼 ff.66 Una cura a tutto?","https://fortissimo.substack.com/p/ff66-una-cura-a-tutto"
"🎼 ff.65 Come fermare il tempo","https://fortissimo.substack.com/p/ff65-come-fermare-il-tempo"
"🎼 ff.64 Metafisica del metaverso","https://fortissimo.substack.com/p/ff64-metafisica-del-metaverso"
"🎼 ff.63 Che cinema!","https://fortissimo.substack.com/p/ff63-che-cinema"
"🎼 ff.62 Come evitare il burnout","https://fortissimo.substack.com/p/ff61-come-evitare-il-burnout"
"🎼 ff.61 La decrescita felice è impossibile?","https://fortissimo.substack.com/p/ff61-la-decrescita-felice-e-impossibile"
"🎼 ff.60 La guida autonoma è qui!","https://fortissimo.substack.com/p/ff60-la-guida-autonoma-e-qui"
"🎼 ff.59 L'ottimismo vola!","https://fortissimo.substack.com/p/ff59-lottimismo-vola"
"🎼 ff.58 Le banane inquinano troppo?","https://fortissimo.substack.com/p/ff58-le-banane-inquinano-troppo"
"🎼 ff.57 Il medico mi ha prescritto una maratona","https://fortissimo.substack.com/p/ff56-il-medico-mi-ha-prescritto-una"
"🎼 ff.56 Il condizionatore terrestre","https://fortissimo.substack.com/p/ff54-il-condizionatore-terrestre"
"🎼 ff.55 Sopravvivere alla rivoluzione","https://fortissimo.substack.com/p/ff54-come-capire-una-rivoluzione"
"🎼 ff.54 Sono stato lasciato da GPT-4","https://fortissimo.substack.com/p/ff54-sono-stato-lasciato-da-gpt-4"
"🎼 ff.53 La cura ai tumori?","https://fortissimo.substack.com/p/ff53-la-cura-ai-tumori"
"🎼 ff.52 Fondare una Nazione in garage","https://fortissimo.substack.com/p/ff52-fondare-una-nazione-in-garage"
"🎼 ff.51 La religione del 21esimo secolo?","https://fortissimo.substack.com/p/ff51-la-religione-del-21esimo-secolo"
"🎼 ff.50 Cosa c**** è successo nel 1971?","https://fortissimo.substack.com/p/ff50-cosa-c-e-successo-nel-1971"
"🎼 ff.49 La pandemia del 21esimo secolo","https://fortissimo.substack.com/p/ff49-la-pandemia-del-21esimo-secolo"
"🎼 ff.48 Risuscitare Aristotele","https://fortissimo.substack.com/p/ff48-resuscitare-aristotele"
"🎼 ff.47 L'artigiano in Fiera (CES)","https://fortissimo.substack.com/p/ff47-la-fiera-dellartigianato-del"
"🎼 ff.46 Elementale, Watson?","https://fortissimo.substack.com/p/ff46-elementale-watson"
"🎼 ff.45 A cavallo tra '22 e '23","https://fortissimo.substack.com/p/il-2022-riassunto-dai-5-migliori"
"🎼 ff.44 Che ansia! (pt. 1)","https://fortissimo.substack.com/p/ff42-che-ansia-pt-1"
"🎼 ff.43 Settimana bianca e Natale","https://fortissimo.substack.com/p/ff43-settimana-bianca-e-natale"
"🎼 ff.42 Made in China (pt.1)","https://fortissimo.substack.com/p/ff41-made-in-china-pt1"
"🎼 ff.41 Non ho parole","https://fortissimo.substack.com/p/ff41-non-ho-parole"
"🎼 ff.40 5 applicazioni dell'AI","https://fortissimo.substack.com/p/ff40-5-applicazioni-dellai"
"🎼 E' passato 1 anno di futuro","https://fortissimo.substack.com/p/e-passato-1-anno-di-futuro"
"🎼 ff.38 Soldi spartiti male","https://fortissimo.substack.com/p/ff38-soldi-spartiti-male"
"🎼 ff.37 Io Robot (o Roomba?)","https://fortissimo.substack.com/p/ff37-i-robot-sono-qui"
"🎼 ff.36 La singolarità è vicina?","https://fortissimo.substack.com/p/ff36-la-singolarita-e-vicina"
"🎼 ff.35 Sto bene, sono Super Sapiens","https://fortissimo.substack.com/p/ff35-siamo-supersapiens"
"🎼 ff.34 Ripensare le città","https://fortissimo.substack.com/p/ff34-ripensare-le-citta"
"🎼 ff.33 Le piante ci salveranno?","https://fortissimo.substack.com/p/-ff33-le-piante-ci-salveranno"
"🎼 ff.32 I numeri non mentono","https://fortissimo.substack.com/p/-ff32-i-numeri-non-mentono"
"🎼 ff.31 L'estate sta iniziando","https://fortissimo.substack.com/p/-ff31-lestate-sta-iniziando"
"🎼 ff.30 DALL-E: genera arte","https://fortissimo.substack.com/p/-ff30-dall-e-genera-arte"
"🎼 ff.29 Viva la mamma!","https://fortissimo.substack.com/p/-ff28-viva-la-mamma"
"🎼 ff.28 Google ricerca il futuro","https://fortissimo.substack.com/p/-ff24-google-ricerca-il-nostro-benessere"
"🎼 ff.27 Un milione di morti COVID (US)","https://fortissimo.substack.com/p/-ff27-un-milione-di-morti-covid-us"
"🎼 ff.26 2022: trend e promesse","https://fortissimo.substack.com/p/-ff26-2022-trend-e-promesse"
"🎼 ff.25 La fattoria degli animali","https://fortissimo.substack.com/p/-ff25-la-fattoria-degli-animali"
"🎼 ff.24 Guerra criptica","https://fortissimo.substack.com/p/-ff26-guerra-criptica"
"🎼 ff.23 Matrimoni privatizzati","https://fortissimo.substack.com/p/-ff21-matrimoni-privatizzati"
"🎼 ff.22 Mangiamo troppo?","https://fortissimo.substack.com/p/-ff22-mangiamo-troppo"
"🎼 ff.21 La magia dell'insalata a domicilio","https://fortissimo.substack.com/p/-ff23-la-magia-dellinsalata-a-domicilio"
"🎼 ff.20 Greta in bici?","https://fortissimo.substack.com/p/-ff20-greta-in-bici"
"🎼 ff.19 L'Hamburger di Hemingway","https://fortissimo.substack.com/p/ff17-lhambuger-di-hemingway"
"🎼 ff.18 Tra arte digitale e AI","https://fortissimo.substack.com/p/-ff17-tra-arte-digitale-e-ai"
"🎼 ff.17 Sport (e chi ne fa le feci)","https://fortissimo.substack.com/p/-ff16-sport-e-chi-ne-fa-le-feci"
"🎼 ff.16 Sossoldi, la transizione ecologica","https://fortissimo.substack.com/p/-ff15-sossoldi-la-transizione-ecologica"
"🎼 ff.15 Assaggi di metaverso","https://fortissimo.substack.com/p/-ff11-assaggi-di-metaverso"
"🎼 ff.14 La guerra non è futuro","https://fortissimo.substack.com/p/-ff14-la-guerra-non-e-futuro"
"🎼 ff.13 Popolazioni e polluzioni","https://fortissimo.substack.com/p/-ff13-popolazioni-e-polluzioni"
"🎼 ff.12 Sole, cuore e amore","https://fortissimo.substack.com/p/-ff10-sole-cuore-e-amore"
"🎼 ff.11 Sparare nel metaverso","https://fortissimo.substack.com/p/-ff10-sparare-nel-metaverso"
"🎼 ff.10 Misurare l'intelligenza","https://fortissimo.substack.com/p/-ff12-misurare-lintelligenza"
"🎼 ff.9 Automazione","https://fortissimo.substack.com/p/-ff9-automazione"
"🎼 ff.8 Combattere la noia","https://fortissimo.substack.com/p/-ff8-combattere-la-noia"
"🎼 ff.7 L'anno che è stato","https://fortissimo.substack.com/p/-ff
"🎼 ff.7 L'anno che è stato","https://fortissimo.substack.com/p/-ff7-lanno-che-e-stato"
"🎼 ff.6 Caro Babbo Natale","https://fortissimo.substack.com/p/-ff6-caro-babbo-natale"
"🎼 ff.5 Elettrizzante!","https://fortissimo.substack.com/p/-ff5-elettrizzante"
"🎼 ff.4 Mammut resuscitati","https://fortissimo.substack.com/p/-ff4-mammut-e-torneo-tremaghi"
"🎼 ff.3 Metaverso","https://fortissimo.substack.com/p/-ff3-metaverso"
"🎼 ff.2 Mente artificiale e psichedelia","https://fortissimo.substack.com/p/-ff2-mente-artificiale-e-psichedelica"
"🎼 ff.1 Clima","https://fortissimo.substack.com/p/-ff1-clima"
"🎼ff. futuro fortissimo","https://fortissimo.substack.com/p/ff-futuro-fortissimo"
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
