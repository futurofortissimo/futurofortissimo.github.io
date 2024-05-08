import re
from html.parser import HTMLParser
from urllib.parse import urljoin, urldefrag

class HTMLToJSON(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs = True
        self.json_data = {}
        self.current_tag = None
        self.current_data = ""

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        attrs_dict = dict(attrs)
        if tag == "title":
            self.json_data["title"] = ""
        elif tag == "description":
            self.json_data["subtitle"] = ""
        elif tag == "enclosure":
            self.json_data["img"] = attrs_dict["url"]
        elif tag == "a":
            if "href" in attrs_dict:
                self.current_data = attrs_dict["href"]

    def handle_data(self, data):
        if self.current_tag == "title":
            self.json_data["title"] += data
        elif self.current_tag == "description":
            self.json_data["subtitle"] += data
        elif self.current_tag == "a":
            self.current_data += data

    def handle_endtag(self, tag):
        if tag == "a" and self.current_data:
            link_text = self.current_data.strip()
            link_url = self.current_data
            if "links" not in self.json_data:
                self.json_data["links"] = []
            self.json_data["links"].append({"text": link_text, "url": link_url})
            self.current_data = ""
        self.current_tag = None

    def handle_startendtag(self, tag, attrs):
        if tag == "link":
            attrs_dict = dict(attrs)
            if "rel" in attrs_dict and attrs_dict["rel"] == "alternate":
                self.json_data["readMoreUrl"] = attrs_dict["href"]

def convert_html_to_json(html_content):
    parser = HTMLToJSON()
    parser.feed(html_content)
    return parser.json_data

# Example usage
with open("DESIRED_HTML_IN.txt", "r", encoding="utf-8") as file:
    html_content = file.read()

json_data = convert_html_to_json(html_content)

import json
with open("EXAMPLE_JSON_OUT.txt", "w", encoding="utf-8") as file:
    json.dump(json_data, file, ensure_ascii=False, indent=2)
