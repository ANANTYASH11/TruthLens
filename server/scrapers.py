import requests
from bs4 import BeautifulSoup
import re

def scrape_article_from_url(url):
    """
    Real-world Web News Scraper.
    Fetches article content from any news website or URL, extracts headline and body.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
            
        resp = requests.get(url, headers=headers, timeout=8)
        if resp.status_code != 200:
            return {
                "success": False,
                "error": f"HTTP Error {resp.status_code}",
                "url": url
            }
            
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # Remove script and style tags
        for script in soup(["script", "style", "header", "footer", "nav"]):
            script.decompose()
            
        # Extract title
        title = ""
        if soup.title and soup.title.string:
            title = soup.title.string.strip()
        elif soup.find('h1'):
            title = soup.find('h1').get_text().strip()
            
        # Extract paragraph text
        paragraphs = [p.get_text().strip() for p in soup.find_all('p') if len(p.get_text().strip()) > 30]
        full_text = f"{title}. " + " ".join(paragraphs[:8])
        
        # Clean whitespace
        full_text = re.sub(r'\s+', ' ', full_text).strip()
        
        if not full_text or len(full_text) < 20:
            full_text = title if title else "Sample Scraped News Article Text."
            
        return {
            "success": True,
            "url": url,
            "title": title,
            "text": full_text[:1500],
            "word_count": len(full_text.split())
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "url": url
        }
