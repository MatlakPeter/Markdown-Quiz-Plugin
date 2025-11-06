import re
# 1. Import the correct BasePlugin from MkDocs
from mkdocs.plugins import BasePlugin

class QuizPlugin(BasePlugin):
    """
    An MkDocs plugin to find a tag and replace it with HTML.
    """
    
    
    FIND_ME = re.compile(r'::mycomponent::')

    
    REPLACE_WITH_HTML = """
    <div style="border: 2px solid #0088ff; padding: 10px; border-radius: 5px; background-color: #f0f8ff;">
        <h3>My Simple HTML Component</h3>
        <p>This was rendered by my first plugin!</p>
    </div>
    """

    def on_page_content(self, html, **kwargs):
        """
        The main MkDocs hook that does the work.
        'markdown' is the full text of a page.
        """
        
       
        return self.FIND_ME.sub(self.REPLACE_WITH_HTML, html)