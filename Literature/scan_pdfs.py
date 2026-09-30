import os
import pypdf

folder = r'd:\MTP\Literature'
pdfs = [f for f in os.listdir(folder) if f.endswith('.pdf')]

print('Scanning local PDFs...')
for pdf in pdfs:
    path = os.path.join(folder, pdf)
    try:
        reader = pypdf.PdfReader(path)
        text = reader.pages[0].extract_text()
        # Print first 100 characters cleaned up
        cleaned = ' '.join(text[:150].replace('\n', ' ').split())
        print(f'{pdf}: {cleaned}')
    except Exception as e:
        print(f'{pdf}: Error - {e}')
