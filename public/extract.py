from bs4 import BeautifulSoup
import argparse
import json
import sys
import os

class HTMLContentManager:
    def __init__(self):
        self.soup = None
        
    def load_html(self, file_path):
        """Load HTML file and create BeautifulSoup object"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                self.soup = BeautifulSoup(file.read(), 'html.parser')
            return True
        except FileNotFoundError:
            print(f"Error: File {file_path} not found.")
            return False
        except Exception as e:
            print(f"Error loading file: {str(e)}")
            return False

    def extract_content(self):
        """Extract text content from HTML and return as structured dictionary"""
        if not self.soup:
            return None
            
        content = {
            "title": "",
            "hero": {
                "title": "",
                "subtitle": ""
            },
            "sections": {}
        }
        
        # Extract title
        if self.soup.title:
            content["title"] = self.soup.title.string.strip()
        
        # Extract hero section
        hero_section = self.soup.find('div', class_='showcase__wrapper')
        if hero_section:
            if hero_title := hero_section.find('h1'):
                content["hero"]["title"] = hero_title.text.strip()
            if hero_subtitle := hero_section.find('p'):
                content["hero"]["subtitle"] = hero_subtitle.text.strip()
        
        # Extract main sections
        for section in self.soup.find_all('section', class_='showcase__section'):
            section_id = section.get('id', '')
            if not section_id:
                continue
                
            section_content = {}
            if section_title := section.find('h2'):
                section_content["title"] = section_title.text.strip()
            
            # Handle different section types
            if section_id == 'features':
                section_content["items"] = [item.text.strip() for item in section.find_all('li')]
            else:
                section_content["content"] = [p.text.strip() for p in section.find_all('p')]
                
            content["sections"][section_id] = section_content
            
        return content

    def format_as_text(self, content):
        """Convert the content dictionary to formatted text"""
        text_lines = []
        
        # Add title
        if content["title"]:
            text_lines.extend(["=== PAGE TITLE ===", content["title"], ""])
        
        # Add hero section
        text_lines.extend([
            "=== HERO SECTION ===",
            f"Title: {content['hero']['title']}",
            f"Subtitle: {content['hero']['subtitle']}",
            ""
        ])
        
        # Add main sections
        for section_id, section_content in content["sections"].items():
            text_lines.extend([
                f"=== {section_content['title'].upper()} ===",
            ])
            
            if section_id == 'features':
                for item in section_content.get("items", []):
                    text_lines.append(f"- {item}")
            else:
                for para in section_content.get("content", []):
                    text_lines.append(para)
            
            text_lines.append("")  # Add blank line between sections
        
        return "\n".join(text_lines)

    def parse_text_file(self, text_content):
        """Parse formatted text file back into content dictionary"""
        content = {
            "title": "",
            "hero": {
                "title": "",
                "subtitle": ""
            },
            "sections": {}
        }
        
        current_section = None
        lines = text_content.split("\n")
        i = 0
        
        while i < len(lines):
            line = lines[i].strip()
            
            if line.startswith("=== ") and line.endswith(" ==="):
                section_name = line[4:-4].strip().lower()
                
                if section_name == "page title":
                    i += 1
                    if i < len(lines):
                        content["title"] = lines[i].strip()
                
                elif section_name == "hero section":
                    i += 1
                    while i < len(lines) and lines[i].strip():
                        line = lines[i].strip()
                        if line.startswith("Title: "):
                            content["hero"]["title"] = line[6:].strip()
                        elif line.startswith("Subtitle: "):
                            content["hero"]["subtitle"] = line[9:].strip()
                        i += 1
                
                else:
                    # Handle other sections
                    section_id = None
                    if "overview" in section_name.lower():
                        section_id = "overview"
                    elif "features" in section_name.lower():
                        section_id = "features"
                    elif "stack" in section_name.lower():
                        section_id = "tech-stack"
                    
                    if section_id:
                        content["sections"][section_id] = {
                            "title": section_name,
                            "items" if section_id == "features" else "content": []
                        }
                        current_section = section_id
                        
                        i += 1
                        while i < len(lines) and lines[i].strip():
                            if section_id == "features":
                                if lines[i].strip().startswith("- "):
                                    content["sections"][section_id]["items"].append(
                                        lines[i].strip()[2:])
                            else:
                                if lines[i].strip():
                                    content["sections"][section_id]["content"].append(
                                        lines[i].strip())
                            i += 1
            i += 1
            
        return content

    def update_content(self, content_dict):
        """Update HTML content with new text from dictionary"""
        if not self.soup:
            return False
            
        try:
            # Update title
            if "title" in content_dict and self.soup.title:
                self.soup.title.string = content_dict["title"]
            
            # Update hero section
            if "hero" in content_dict:
                hero_section = self.soup.find('div', class_='showcase__wrapper')
                if hero_section:
                    if "title" in content_dict["hero"] and (h1 := hero_section.find('h1')):
                        h1.string = content_dict["hero"]["title"]
                    if "subtitle" in content_dict["hero"] and (p := hero_section.find('p')):
                        p.string = content_dict["hero"]["subtitle"]
            
            # Update main sections
            if "sections" in content_dict:
                for section_id, section_content in content_dict["sections"].items():
                    section = self.soup.find('section', id=section_id)
                    if not section:
                        continue
                        
                    if "title" in section_content and (h2 := section.find('h2')):
                        h2.string = section_content["title"]
                    
                    if section_id == 'features' and "items" in section_content:
                        ul = section.find('ul')
                        if ul:
                            ul.clear()
                            for item in section_content["items"]:
                                li = self.soup.new_tag('li')
                                li.string = item
                                ul.append(li)
                    elif "content" in section_content:
                        for i, content in enumerate(section_content["content"]):
                            if p := section.find_all('p')[i]:
                                p.string = content
            
            return True
        except Exception as e:
            print(f"Error updating content: {str(e)}")
            return False

    def save_html(self, file_path):
        """Save updated HTML to file"""
        if not self.soup:
            return False
            
        try:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(str(self.soup.prettify()))
            return True
        except Exception as e:
            print(f"Error saving file: {str(e)}")
            return False

def main():
    parser = argparse.ArgumentParser(description='HTML Content Manager - Extract or Update HTML content')
    parser.add_argument('action', choices=['extract', 'update'], help='Action to perform')
    parser.add_argument('input_file', help='Input HTML file')
    parser.add_argument('output_file', help='Output file (JSON/TXT for extract, JSON/TXT for update)')
    
    args = parser.parse_args()
    
    manager = HTMLContentManager()
    
    if not manager.load_html(args.input_file):
        sys.exit(1)
    
    # Determine file type from extension
    is_json = args.output_file.lower().endswith('.json')
    
    if args.action == 'extract':
        content = manager.extract_content()
        if content:
            try:
                with open(args.output_file, 'w', encoding='utf-8') as f:
                    if is_json:
                        json.dump(content, f, indent=2)
                    else:
                        f.write(manager.format_as_text(content))
                print(f"Content successfully extracted to {args.output_file}")
            except Exception as e:
                print(f"Error saving output: {str(e)}")
                sys.exit(1)
    
    else:  # update
        try:
            with open(args.output_file, 'r', encoding='utf-8') as f:
                if is_json:
                    new_content = json.load(f)
                else:
                    new_content = manager.parse_text_file(f.read())
        except Exception as e:
            print(f"Error loading content: {str(e)}")
            sys.exit(1)
            
        if manager.update_content(new_content):
            if manager.save_html(args.input_file + '.updated.html'):
                print(f"HTML successfully updated and saved to {args.input_file}.updated.html")
            else:
                print("Error saving updated HTML")
                sys.exit(1)
        else:
            print("Error updating content")
            sys.exit(1)

if __name__ == "__main__":
    main()