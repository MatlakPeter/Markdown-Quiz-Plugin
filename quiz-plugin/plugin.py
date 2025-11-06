import re
from mkdocs.plugins import BasePlugin

class QuizPlugin(BasePlugin):
  
    
    FIND_ME = re.compile(r'::mycomponent::')

    
    REPLACE_WITH_HTML = """
    <div style="border: 2px solid #0088ff; padding: 10px; border-radius: 5px; background-color: #f0f8ff;">
        <h3>My Simple HTML Component</h3>
        <p>This was rendered by my first plugin!</p>
    </div>
    """

    def on_page_content(self, html, **kwargs):
      

       
        return self.FIND_ME.sub(self.REPLACE_WITH_HTML, html)