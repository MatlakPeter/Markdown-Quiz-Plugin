import re
from mkdocs.plugins import BasePlugin

class QuizPlugin(BasePlugin):
        
    pattern = re.compile(r'^::question::(.*?)', flags=re.MULTILINE | re.DOTALL)
    REPLACE_WITH = r'\1'

    def on_page_markdown(self, markdown, **kwargs):
            
        return self.pattern.sub(self.REPLACE_WITH, markdown)