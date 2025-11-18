import re
from mkdocs.plugins import BasePlugin

QUESTION_REGEX = re.compile(
    r'^::question::(.*?)$',
    flags=re.MULTILINE | re.DOTALL
)
ANSWER_REGEX = re.compile(
    r'^\s*\[( |x)\]\s*(.*)',
    flags=re.MULTILINE
)
class QuizPlugin(BasePlugin):
    def on_page_markdown(self, markdown, **kwargs):
        markdown = QUESTION_REGEX.sub(
            r'<div class="quiz-question">\1</div>', 
            markdown
        )
        markdown = ANSWER_REGEX.sub(
            self._answer_replacer,
            markdown
        )

        return markdown

    def _answer_replacer(self, match):
        marker = match.group(1)
        
        text = match.group(2)
        
        if marker == 'x':
            is_correct = "true"
        else:
            is_correct = "false"
            
        return f'<button class="quiz-answer" data-correct="{is_correct}">{text}</button>'