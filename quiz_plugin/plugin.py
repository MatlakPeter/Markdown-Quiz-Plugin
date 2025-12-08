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

        # Add SortableJS for the ordering questions
        config['extra_javascript'].append('https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js')

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

    # --- REGEX DEFINITIONS ---
    INCLUDE_REGEX = re.compile(r'^\s*include\((.+?)\)', flags=re.MULTILINE)
    QUIZ_BLOCK_REGEX = re.compile(r'@start(.*?)@end', flags=re.DOTALL)
    QUESTION_SPLIT_REGEX = re.compile(r'(?:^|\n)\s*---\s*(?:\n|$)')
    ANSWER_REGEX = re.compile(r'^\s*\[(x|\s)?\]\s*(.*)', flags=re.MULTILINE)
    DROPDOWN_REGEX = re.compile(r'\{\{(.+?)\}\}')
    ORDER_ITEM_REGEX = re.compile(r'^\s*\((\d+)\.\)\s*(.*)$', flags=re.MULTILINE | re.UNICODE)

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
            
            # Robust split: check if separators exist, otherwise treat as single question
            if '---' in block_content:
                raw_questions = self.QUESTION_SPLIT_REGEX.split(block_content)
            else:
                raw_questions = [block_content]
            
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
        question_text_parts = []
        answers_html = []
        order_items = []
        correct_answer_count = 0
        
        # --- PARSING PHASE ---
        for line in lines:
            line = line.strip()
            if not line: continue
            
            # 1. Check for Ordering Item: (1.) Item Text
            normalized_line = line.replace('\xa0', ' ')
            order_match = self.ORDER_ITEM_REGEX.match(normalized_line)
            
            if order_match:
                item_number = int(order_match.group(1))
                item_text = order_match.group(2).strip()
                order_items.append((item_number, item_text))
                continue

            # 2. Check for Standard Answers: [x] Correct or [ ] Incorrect
            ans_match = self.ANSWER_REGEX.match(line)
            if ans_match:
                is_correct_marker = ans_match.group(1) == 'x'
                if is_correct_marker:
                    correct_answer_count += 1
                
                is_correct_str = "true" if is_correct_marker else "false"
                ans_text = ans_match.group(2)
                
                answers_html.append(
                    f'<button class="quiz-answer" data-correct="{is_correct_str}">{ans_text}</button>'
                )
            else:
                # Regular text line (question body)
                question_text_parts.append(line)

        full_question_text = " ".join(question_text_parts)
        
        # --- DROPDOWN PROCESSING ---
        # Only process dropdowns if we aren't doing an ordering question
        has_dropdown = False
        if not order_items:
            def replace_dropdown(match):
                content = match.group(1)
                raw_options = content.split('|')
                
                processed_options = []
                for i, opt in enumerate(raw_options):
                    opt = opt.strip()
                    is_correct = "true" if i == 0 else "false"
                    processed_options.append({"text": opt, "is_correct": is_correct})
                
                
                
                select_html = ['<select class="quiz-dropdown">']
                select_html.append('<option disabled>Choose...</option>')
                for item in processed_options:
                    select_html.append(
                        f'<option data-correct="{item["is_correct"]}">{item["text"]}</option>'
                    )
                select_html.append('</select>')
                return "".join(select_html)

            # Check if dropdown exists before replacing to set flag
            if self.DROPDOWN_REGEX.search(full_question_text):
                has_dropdown = True
                full_question_text = self.DROPDOWN_REGEX.sub(replace_dropdown, full_question_text)

        # --- HTML GENERATION ---
        
        display_style = ' style="display: none;"' if index > 0 else ''

        # CASE A: Ordering Question
        if order_items:
            # Sort by correct index to ensure data integrity
            order_items.sort(key=lambda x: x[0])
            
            # Create HTML items
            list_items_html = []
            for item_number, item_text in order_items:
                list_items_html.append(
                    f'<div class="quiz-order-item" data-correct-order="{item_number}" draggable="true">{item_text}</div>'
                )
            
            
            return f'''
            <div class="quiz-question-block" data-question-index="{index}" data-type="ordering"{display_style}>
                <p class="quiz-question">{full_question_text}</p>
                <div class="quiz-ordering-list">
                    {"".join(list_items_html)}
                </div>
            </div>
            '''

        # CASE B: Dropdown Question
        if has_dropdown:
            return f'''
            <div class="quiz-question-block" data-question-index="{index}" data-type="dropdown"{display_style}>
                <p class="quiz-question">{full_question_text}</p>
            </div>
            '''

        # CASE C: Standard Multiple/Single Choice
        data_type_attr = ' data-type="multiple"'
        if correct_answer_count == 1:
            data_type_attr = ' data-type="single"'
            
        answers_block = ""
        if answers_html:
            answers_block = f'<div class="quiz-answer-container">{"".join(answers_html)}</div>'

        return f'''
        <div class="quiz-question-block" data-question-index="{index}"{data_type_attr}{display_style}>
            <p class="quiz-question">{full_question_text}</p>
            {answers_block}
        </div>
        '''