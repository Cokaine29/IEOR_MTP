import urllib.request
import urllib.parse
import os
import json

papers = [
    ("Egbelu Tanchoco 1984 Characterization automatic guided vehicle dispatching rules", "Egbelu_Tanchoco_1984.pdf"),
    ("Grunow Gunther Lehmann 2004 Dispatching strategies for AGVs at automated seaport terminals", "Grunow_Gunther_2004.pdf"),
    ("Briskorn Drexl Hartmann 2006 Inventory-based dispatching of AGVs at seaport container terminals", "Briskorn_Drexl_2006.pdf"),
    ("Vis Harika 2004 Fleet sizing and vehicle-type comparison by simulation", "Vis_Harika_2004.pdf"),
    ("Lehmann Grunow Gunther 2006 Deadlock handling for real-time control of AGVs", "Lehmann_Grunow_2006.pdf"),
    ("Angeloudis Bell 2010 uncertainty-aware AGV assignment algorithm", "Angeloudis_Bell_2010.pdf"),
    ("Choe Kim Ryu 2016 Online preference learning for adaptive AGV dispatching ACT", "Choe_Kim_Ryu_2016.pdf"),
    ("Carlo Vis Roodbergen 2014 Transport dispatching and routing in yard operations for container terminals", "Carlo_Vis_Roodbergen_2014.pdf"),
    ("Agarwal 2021 Deep reinforcement learning at the edge of the statistical precipice", "Agarwal_et_al_2021.pdf")
]

folder = r'd:\MTP\Literature'
downloaded = []

for query, filename in papers:
    print(f'Searching for: {query}')
    try:
        url = 'https://api.semanticscholar.org/graph/v1/paper/search?query=' + urllib.parse.quote(query) + '&limit=1&fields=title,url,openAccessPdf'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            
        if 'data' in data and len(data['data']) > 0:
            paper = data['data'][0]
            print(f"  Found: {paper.get('title')}")
            pdf_info = paper.get('openAccessPdf')
            if pdf_info and pdf_info.get('url'):
                pdf_url = pdf_info['url']
                print(f"  Downloading PDF: {pdf_url}")
                save_path = os.path.join(folder, filename)
                
                # Fetch PDF
                req_pdf = urllib.request.Request(pdf_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req_pdf, timeout=15) as res_pdf, open(save_path, 'wb') as out_file:
                    out_file.write(res_pdf.read())
                downloaded.append(filename)
                print(f"  Saved as {filename}")
            else:
                print("  No Open Access PDF found.")
        else:
            print("  Not found in Semantic Scholar.")
    except Exception as e:
        print(f"  Error: {e}")

print(f'\nSuccessfully downloaded {len(downloaded)} papers.')
