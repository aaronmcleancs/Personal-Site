from xml.etree import ElementTree as ET
import colorsys

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(*rgb)

def generate_color_gradient(brightest_color, steps):
    brightest_rgb = hex_to_rgb(brightest_color)
    hsv = colorsys.rgb_to_hsv(*[x / 255.0 for x in brightest_rgb])
    
    color_gradient = []
    for step in range(steps):
        scale = 1 - (step / (steps - 1))
        faded_rgb = colorsys.hsv_to_rgb(hsv[0], hsv[1], hsv[2] * scale)
        faded_rgb = tuple(int(x * 255) for x in faded_rgb)
        color_gradient.append(rgb_to_hex(faded_rgb))
    
    return color_gradient

def replace_svg_colors(input_file, output_file, brightest_color):
    tree = ET.parse(input_file)
    root = tree.getroot()

    rects_and_paths = [el for el in root.iter() if el.tag.endswith('rect') or el.tag.endswith('path')]
    gradient_colors = generate_color_gradient(brightest_color, len(rects_and_paths))
    
    gradient_colors.reverse()

    for el, color in zip(rects_and_paths, gradient_colors):
        el.set('fill', color)

    tree.write(output_file)

brightest_color = "#7192e3" 
replace_svg_colors("sgsgsg.svg", "output.svg", brightest_color)
