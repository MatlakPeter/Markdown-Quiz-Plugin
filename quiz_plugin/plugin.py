import re
from mkdocs.plugins import BasePlugin

class QuizPlugin(BasePlugin):
    FIND_ME = re.compile(r'::mycomponent::')
    REPLACE_WITH_HTML = """
<div class="quiz-component">
    <div class="quiz-box">
        <h3>My Simple HTML Component</h3>
        <p>This was rendered by my first plugin!</p>
        <div class="quiz-answers">
            <button class="quiz-answer" data-correct="false">Wrong Answer 1</button>
            <button class="quiz-answer" data-correct="true">Correct Answer</button>
            <button class="quiz-answer" data-correct="false">Wrong Answer 2</button>
            <button class="quiz-answer" data-correct="false">Wrong Answer 3</button>
        </div>
    </div>
</div>
"""
    
    def on_page_content(self, html, **kwargs):
        return self.FIND_ME.sub(self.REPLACE_WITH_HTML, html)
    
    def on_post_page(self, output, **kwargs):
        # Inject the JavaScript file reference before the closing body tag
        js_injection = '<script src="/js/quiz.js"></script>'
        output = output.replace('</body>', f'{js_injection}</body>')
        return output