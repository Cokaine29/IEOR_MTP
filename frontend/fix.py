import re

file_path = 'public/literature/carlo_2014/notes.md'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'<p align="center">\s*<br>\s*<img src="(.*?)" alt="(.*?)">\s*<br>\s*<em>.*?</em>\s*</p>'
text = re.sub(pattern, r'![\2](\1)', text, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
