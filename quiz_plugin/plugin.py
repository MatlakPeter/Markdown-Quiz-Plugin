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
    INCLUDE_REGEX = re.compile(r'^\s*@include:\s*(.+)$', flags=re.MULTILINE)
    QUIZ_BLOCK_REGEX = re.compile(r'@START(.*?)@END', flags=re.DOTALL)
    QUESTION_SPLIT_REGEX = re.compile(r'(?:^|\n)\s*---\s*(?:\n|$)')
    ANSWER_REGEX = re.compile(r'^\s*\[(x|\s)?\]\s*(.*)', flags=re.MULTILINE)
    DROPDOWN_REGEX = re.compile(r'\{\{(.+?)\}\}')
    ORDER_ITEM_REGEX = re.compile(r'^\s*\((\d+)\.\)\s*(.*)$', flags=re.MULTILINE | re.UNICODE)
    IMAGE_REGEX = re.compile(r'!\[(.*?)\]\((.*?)\)')
    QUIZ_ID_REGEX = re.compile(r'@id:\s*(.+)', flags= re.IGNORECASE)
    MATCHING_REGEX = re.compile(r'^\s*\{(.+?)\|(.+?)\}', flags=re.MULTILINE)
    # REGEX FOR DATA PROCESSING 
    QUIZ_BLOCK_REGEX = re.compile(r'@START(.*?)@END', flags=re.DOTALL)
    QUIZ_META_LINE_REGEX = re.compile(r'^\s*@(\w+)\s*:\s*(.+)$', re.MULTILINE)

    def _extract_quiz_meta(self, block_content):
        meta = {}

        for match in self.QUIZ_META_LINE_REGEX.finditer(block_content):
            key = match.group(1).lower()
            value = match.group(2).strip()
            meta[key] = value

        cleaned = self.QUIZ_META_LINE_REGEX.sub('', block_content)
        return meta, cleaned

    def _render_start_screen(self, meta):
        if not meta:
            return """
            <div class="quiz-start-screen">
                <button class="quiz-btn-start">Start Quiz</button>
            </div>
            """

        parts = ['<div class="quiz-start-screen">']

        if "title" in meta:
            parts.append(f'<h2 class="quiz-title">{meta["title"]}</h2>')

        if "description" in meta:
            parts.append(
                f'''
                <div class="quiz-description">
                    <p>{meta["description"]}</p>
                </div>
                '''
            )

        meta_items = []
        if "author" in meta:
            meta_items.append(f'<span class="quiz-meta-item"> Author: {meta["author"]}</span>')
        if "time_limit" in meta:
            minutes = int(int(meta["time_limit"]))
            meta_items.append(f'<span class="quiz-meta-item"> Time: {minutes} Min</span>')

        if meta_items:
            parts.append(f'''
            <div class="quiz-meta-info">
                {"".join(meta_items)}
            </div>
            ''')

        parts.append('<button class="quiz-btn-start">Start Quiz</button>')
        parts.append('</div>')

        return "\n".join(parts)

    def _normalize_choice(self, value, allowed, default):
        if value is None:
            return default
        value = value.strip().lower()
        if value not in allowed:
            log.warning(f"[QuizPlugin] Invalid value '{value}', using default '{default}'")
            return default
        return value

    
    def on_page_markdown(self, markdown, page, config, **kwargs):
        if not self.config['enabled']:
            return markdown

        markdown = self._process_includes(markdown, page)
        markdown = self._process_quizzes(markdown)

        return markdown

    def _process_includes(self, markdown, page):
        def replace_include(match):
            args = [arg.strip() for arg in match.group(1).split(',')]
            filename = args[0]
            specified_ids = [s.strip() for s in args[1:]] # Ensure IDs are trimmed
            current_file_dir = os.path.dirname(page.file.abs_src_path)
            target_file_path = os.path.join(current_file_dir, filename)

            try:
                with open(target_file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # If the content itself contains further @include statements, 
                # process it recursively now to fully expand the file content.
                processed_content = self._process_includes(content, page)

                if specified_ids:
                    # Logic for ID Filtering (US #104)
                    blocks = self.QUIZ_BLOCK_REGEX.findall(processed_content)
                    found_blocks = ""
                    for block_content in blocks:
                        # Extract metadata from the block content (which is the inner text)
                        block_meta, _ = self._extract_quiz_meta(block_content)
                        quiz_id = block_meta.get("id", "").strip() 
                        
                        # Compare extracted ID (case-sensitive as per your requirement)
                        if quiz_id in specified_ids: 
                            # Reconstruct the block with tags for the main routine to process later
                            found_blocks += f"@START\n{block_content.strip()}\n@END\n" 
                    
                    return found_blocks.strip() # Return only the filtered blocks
                
                else: 
                    # Logic for Simple Inclusion (No ID specified)
                    return processed_content.strip() # Return all expanded content
                    
            except FileNotFoundError:
                error_msg = f"Error: File not found: {filename}"
                log.warning(f"[QuizPlugin] {error_msg}")
                return f'<p style="color: red;">{error_msg}</p>'
            except Exception as e:
                log.error(f"[QuizPlugin] Error reading {filename}: {e}")
                return ""
        
        return self.INCLUDE_REGEX.sub(replace_include, markdown)

    def _process_quizzes(self, markdown):
        """
        Finds all quiz blocks (@START...@END) and replaces them with the
        rendered HTML structure.
        """
        def replace_quiz_block(match):
            block_content = match.group(1)

            # 1. Extract Meta-data and Clean Content
            quiz_meta, block_content = self._extract_quiz_meta(block_content)

            # 2. Split into Questions
            if '---' in block_content:
                # Split using regex, and clean up empty strings caused by trailing/leading delimiters
                raw_questions = self.QUESTION_SPLIT_REGEX.split(block_content)
            else:
                # Treat the entire content as a single question if no separator is found
                raw_questions = [block_content]
            
            # Filter out empty strings/whitespace leftover from splitting
            questions = [q for q in raw_questions if q.strip()]
            
            # 3. Define Container Attributes
            # Ensure the 'id' meta is extracted (it's in quiz_meta due to _extract_quiz_meta)
            container_attrs = {
                "id": quiz_meta.get("id"),
                "layout": self._normalize_choice(quiz_meta.get("layout"), allowed={"book", "list"}, default="book"),
                "timer": quiz_meta.get("time_limit"),
                "shuffle-questions": self._normalize_choice(quiz_meta.get("shuffle_questions"), allowed={"true", "false"}, default="false"),
                "shuffle-answers": self._normalize_choice(quiz_meta.get("shuffle_answers"), allowed={"true", "false"}, default="true"),
                "feedback-mode": self._normalize_choice(quiz_meta.get("feedback_mode"), allowed={"immediate", "end"}, default="end"),
                "allow-skip": self._normalize_choice(quiz_meta.get("allow_skip"), allowed={"true", "false"}, default="true"),
                "enable-survey": self._normalize_choice(quiz_meta.get("enable_survey"), allowed={"true", "false"}, default="false"),
            }

            data_attrs = " ".join(
                # Generate 'data-key="value"' strings, skipping attributes that are None/empty
                f'data-{k}="{v}"' for k, v in container_attrs.items() if v is not None and v != ""
            )

            # 4. Assemble HTML Output
            html_output = []
            
            # Open the main quiz container (CRITICAL: Contains all quiz content)
            html_output.append(f'<div class="quiz-container" markdown="1" {data_attrs}>')
            
            # Add the Start Screen
            html_output.append(self._render_start_screen(quiz_meta))
            
            # Open the main wrapper (Hidden until the user presses Start)
            html_output.append('<div class="quiz-main-wrapper" style="display: none;">')
            
            # Add Header (Timer/Progress Bar)
            html_output.append("""
                <div class="quiz-header">
                    
                    <div class="quiz-timer-display">
                        Time Left: <span id="time-display"></span>
                    </div>
                    
                    <div class="quiz-progress-container">
                        <div class="quiz-progress-bar"></div>
                    </div>
                    
                    <span class="quiz-status-text"></span>
                    
                </div>
            """)
            
            # Add Questions
            for index, q_text in enumerate(questions):
                q_html = self._render_single_question(q_text, index)
                html_output.append(q_html)

            # Add Navigation/Footer
            html_output.append(f'''
            <div class="quiz-navigation">
                <button class="quiz-nav-previous" style="display: none;">Previous</button>  
                <span class="quiz-status-text"></span>
                <button class="quiz-nav-next">Next</button>
                <button class="quiz-nav-submit" style="display: none;">Submit</button>
            </div>
            ''')
            
            # Add Results Div
            html_output.append('<div class="quiz-results"></div>')

            # --- CRITICAL CLOSING FIX ---
            # Close the quiz-main-wrapper
            html_output.append('</div>') 
            
            # Close the quiz-container (PREVENTS CONTENT LEAKAGE)
            html_output.append('</div>') 
            # --- END CRITICAL CLOSING FIX ---

            return "\n".join(html_output)

        # Substitute all @START...@END blocks using the replacement function
        return self.QUIZ_BLOCK_REGEX.sub(replace_quiz_block, markdown)


    def _render_single_question(self, text, index):
        lines = text.strip().split('\n')
        question_text_parts = []
        answers_html = []
        order_items = []
        match_pairs = []
        correct_answer_count = 0
        
        def replace_image(match):
            alt_text = match.group(1)
            src_url = match.group(2)
            return f'<br><img src="{src_url}" alt="{alt_text}" class="quiz-image">'
        
        # --- PARSING PHASE ---
        for line in lines:
            line = line.strip()
            if not line: continue
            normalized_line = line.replace('\xa0', ' ')
            
            # Check for Matching {A|B}
            matching_match = self.MATCHING_REGEX.match(normalized_line)
            if matching_match:
                left_text = matching_match.group(1).strip()
                right_text = matching_match.group(2).strip()
                pair_id = f"{len(match_pairs)}"
                match_pairs.append((left_text, right_text, pair_id))
                continue
                
            # Check for Ordering Item: (1.) Item Text
            order_match = self.ORDER_ITEM_REGEX.match(normalized_line)
            if order_match:
                item_number = int(order_match.group(1))
                item_text = order_match.group(2).strip()
                if self.IMAGE_REGEX.search(item_text):
                   item_text = self.IMAGE_REGEX.sub(replace_image, item_text)
                
                order_items.append((item_number, item_text))
                continue

            # Check for Standard Answers: [x] Correct or [ ] Incorrect
            ans_match = self.ANSWER_REGEX.match(line)
            if ans_match:
                is_correct_marker = ans_match.group(1) == 'x'
                if is_correct_marker:
                    correct_answer_count += 1
                
                is_correct_str = "true" if is_correct_marker else "false"
                ans_text = ans_match.group(2)
                
                if self.IMAGE_REGEX.search(ans_text):
                    ans_text = self.IMAGE_REGEX.sub(replace_image, ans_text)
                    
                answers_html.append(
                    f'<button class="quiz-answer" data-correct="{is_correct_str}">{ans_text}</button>'
                )
            else:
                # Regular text line (question body)
                question_text_parts.append(line)

        # question
        full_question_text = " ".join(question_text_parts)
        if self.IMAGE_REGEX.search(full_question_text):
            full_question_text = self.IMAGE_REGEX.sub(replace_image, full_question_text)
        
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
        # Matching Question
        if match_pairs:
            left_items = []
            right_items = []
            for left, right, pid in match_pairs:
                left_items.append(f'<button class="quiz-match-item" data-pair-id="{pid}">{left}</button>')
                right_items.append(f'<button class="quiz-match-item" data-pair-id="{pid}">{right}</button>')
            return f'''
            <div class="quiz-question-block" data-question-index="{index}" data-type="matching"{display_style}>
                <p class="quiz-question">{full_question_text}</p>
                
                <div class="quiz-match-solved-area"></div>
                
                <div class="quiz-matching-container">
                    <div class="quiz-match-left">
                        {"".join(left_items)}
                    </div>
                    <div class="quiz-match-right">
                        {"".join(right_items)}
                    </div>
                </div>
            </div>
            '''
        # Ordering Question
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

        # Dropdown Question
        if has_dropdown:
            return f'''
            <div class="quiz-question-block" data-question-index="{index}" data-type="dropdown"{display_style}>
                <p class="quiz-question">{full_question_text}</p>
            </div>
            '''

        # Standard Multiple/Single Choice
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