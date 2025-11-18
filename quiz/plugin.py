import re
from mkdocs.plugins import BasePlugin

class QuizPlugin(BasePlugin):
    # Regex pattern to find your custom syntax
    FIND_ME = re.compile(r'::mycomponent::')
    
    # HTML to insert instead
    REPLACE_WITH_HTML = """<div>...</div>"""
    
    # Hook that runs after markdown is converted to HTML
    def on_page_content(self, html, **kwargs):
        # Find and replace in the HTML
        return self.FIND_ME.sub(self.REPLACE_WITH_HTML, html)

