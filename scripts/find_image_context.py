import glob
import re

for f in glob.glob('scripts/*.html') + glob.glob('scripts/*.json'):
    try:
        with open(f, encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
            for img in ['040', '046', '070', 'IMG_9577', 'IMG_1999', 'DSC00528', 'DSC_3491', 'P1055743', 'barrels']:
                if img in content:
                    for match in re.finditer(r'([^\n<>\'"]{0,50}' + img + r'[^\n<>\'"]{0,50})', content):
                        print(f'{f}: {match.group(0)}')
    except Exception as e:
        pass
