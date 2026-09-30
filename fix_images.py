import re

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Regex to match the exact HTML format we used
        pattern = r'<p align="center"><br><img src="([^"]+)" alt="([^"]+)"><br><em>([^<]+)</em></p>'
        
        # Replace with standard markdown
        replacement = r'![\2](\1)\n\n*\3*'
        
        new_content = re.sub(pattern, replacement, content)
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Fixed {filepath}')
        else:
            print(f'No changes needed for {filepath}')
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

files_to_fix = [
    'd:/MTP/Literature/01_Egbelu_1984.md',
    'd:/MTP/Literature/02_Carlo_2014.md',
    'd:/MTP/frontend/public/literature/egbelu_1984/notes.md',
    'd:/MTP/frontend/public/literature/carlo_2014/notes.md'
]

for file in files_to_fix:
    fix_file(file)
