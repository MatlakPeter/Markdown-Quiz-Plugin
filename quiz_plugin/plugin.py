import re
from mkdocs.plugins import BasePlugin

class QuizPlugin(BasePlugin):
    # two different types of quizzes
    SINGLE_CHOICE = re.compile(r'::singlechoice::') 
    TRUE_FALSE = re.compile(r'::truefalse::')
    SINGLE_CHOICE_HTML = """
<div class="quiz-component">
    <div class="quiz-box">
        <h3>Single Choice Question</h3>
        <p>This is a single choice question.</p>
        <div class="quiz-answers">
            <button class="quiz-answer" data-correct="false">Wrong Answer 1</button>
            <button class="quiz-answer" data-correct="true">Correct Answer</button>
            <button class="quiz-answer" data-correct="false">Wrong Answer 2</button>
            <button class="quiz-answer" data-correct="false">Wrong Answer 3</button>
        </div>
    </div>
</div>
"""
    TRUE_FALSE_HTML = """
<div class="quiz-component">
    <div class="quiz-box">
        <h3>True or False Question</h3>
        <p>This statement is FALSE.</p>
        <div class="quiz-answers">
            <button class="quiz-answer" data-correct="false">True</button>
            <button class="quiz-answer" data-correct="true">False</button>
        </div>
    </div>
</div>
"""
    
    def on_page_content(self, html, **kwargs):
        # Replace multiple choice quizzes
        html = self.SINGLE_CHOICE.sub(self.SINGLE_CHOICE_HTML, html)
        # Replace true/false quizzes
        html = self.TRUE_FALSE.sub(self.TRUE_FALSE_HTML, html)
        return html
    
    def on_post_page(self, output, **kwargs):
        # Inject the JavaScript file reference before the closing body tag
        js_injection = '<script src="/js/quiz.js"></script>'
        output = output.replace('</body>', f'{js_injection}</body>')
        return output