import re

svg_file_path = '/Users/aaronmclean/Desktop/Work/GitHub/personalsite/public/sgsgsg.svg'
colors_file_path = 'colors.txt'

fill_pattern = re.compile(r'fill="([^"]+)"')

try:
    with open(svg_file_path, 'r') as svg_file, open(colors_file_path, 'w') as colors_file:
        for line in svg_file:
            for match in fill_pattern.finditer(line):
                colors_file.write(f'fill="{match.group(1)}"></p>\n')
    print("Color extraction completed.")
except FileNotFoundError:
    print(f"Error: '{svg_file_path}' file not found.")
except Exception as e:
    print(f"An error occurred: {e}")

