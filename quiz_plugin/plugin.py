import os
import shutil
import re
import logging
from mkdocs.plugins import BasePlugin
from mkdocs.config import config_options

log = logging.getLogger('mkdocs')

class QuizPlugin(BasePlugin):
    
    config_scheme = (
        ('enabled', config_options.Type(bool, default=True)),
    )

    def on_config(self, config):
        if not self.config['enabled']:
            return config

        config['extra_css'].append('assets/quiz.css')
        config['extra_javascript'].append('assets/quiz.js')

        return config

    def on_post_build(self, config):
        if not self.config['enabled']:
            return

        current_dir = os.path.dirname(__file__)
        assets_source_dir = os.path.join(current_dir, 'assets')

        assets_dest_dir = os.path.join(config['site_dir'], 'assets')

        os.makedirs(assets_dest_dir, exist_ok=True)

        if os.path.exists(assets_source_dir):
            for filename in os.listdir(assets_source_dir):
                if filename.endswith('.css') or filename.endswith('.js'):
                    src_file = os.path.join(assets_source_dir, filename)
                    dst_file = os.path.join(assets_dest_dir, filename)
                    shutil.copyfile(src_file, dst_file)
        else:
            log.warning("[QuizPlugin] 'assets' directory not found. CSS/JS might be missing.")

    INCLUDE_REGEX = re.compile(r'^\s*include\((.+?)\)', flags=re.MULTILINE)
    
    QUIZ_BLOCK_REGEX = re.compile(r'@start(.*?)@end', flags=re.DOTALL)
    
    QUESTION_SPLIT_REGEX = re.compile(r'(?:^|\n)\s*---\s*(?:\n|$)')
    
    ANSWER_REGEX = re.compile(r'^\s*\[(x|\s)?\]\s*(.*)', flags=re.MULTILINE)


    def on_page_markdown(self, markdown, page, config, **kwargs):
        if not self.config['enabled']:
            return markdown

        markdown = self._process_includes(markdown, page)

        markdown = self._process_quizzes(markdown)

        return markdown

    def _process_includes(self, markdown, page):
        def replace_include(match):
            filename = match.group(1).strip()
            current_file_dir = os.path.dirname(page.file.abs_src_path)
            target_file_path = os.path.join(current_file_dir, filename)

            try:
                with open(target_file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                return self._process_includes(content, page)
            except FileNotFoundError:
                error_msg = f"Error: File not found: {filename}"
                log.warning(f"[QuizPlugin] {error_msg}")
                return f'<p style="color: red;">{error_msg}</p>'
            except Exception as e:
                log.error(f"[QuizPlugin] Error reading {filename}: {e}")
                return ""

        return self.INCLUDE_REGEX.sub(replace_include, markdown)

    def _process_quizzes(self, markdown):
        def replace_quiz_block(match):
            block_content = match.group(1)
            
            raw_questions = self.QUESTION_SPLIT_REGEX.split(block_content)
            
            questions = [q for q in raw_questions if q.strip()]
            
            html_output = ['<div class="quiz-container" markdown="1">']
            
            html_output.append('''
            <div class="quiz-progress-container">
                <div class="quiz-progress-bar" style="width: 50%"></div>
            </div>
            ''')
            
            for index, q_text in enumerate(questions):
                q_html = self._render_single_question(q_text, index)
                html_output.append(q_html)

            html_output.append(f'''
            <div class="quiz-navigation">
                <button class="quiz-nav-previous" style="display: none;">Previous</button>  
                <span class="quiz-status-text"></span>
                <button class="quiz-nav-next">Next</button>
                <button class="quiz-nav-submit" style="display: none;">Submit</button>
            </div>
            ''')
            html_output.append('<div class="quiz-results"></div>')
            html_output.append('</div>')

            return "\n".join(html_output)

        return self.QUIZ_BLOCK_REGEX.sub(replace_quiz_block, markdown)

    def _render_single_question(self, text, index):
        lines = text.strip().split('\n')
        question_text = ""
        answers_html = []
        
        for line in lines:
            line = line.strip()
            if not line: continue
            
            ans_match = self.ANSWER_REGEX.match(line)
            if ans_match:
                is_correct = "true" if ans_match.group(1) == 'x' else "false"
                ans_text = ans_match.group(2)
                answers_html.append(
                    f'<button class="quiz-answer" data-correct="{is_correct}">{ans_text}</button>'
                )
            else:
                if question_text: question_text += " " + line
                else: question_text = line

        display_style = ' style="display: none;"' if index > 0 else ''
        
        return f'''
        <div class="quiz-question-block" data-question-index="{index}"{display_style}>
            <p class="quiz-question">{question_text}</p>
            <div class="quiz-answer-container">
                {"".join(answers_html)}
            </div>
        </div>
        '''