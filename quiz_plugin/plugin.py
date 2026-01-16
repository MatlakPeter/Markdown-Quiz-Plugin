import os
import shutil
import re
import logging
import html
from mkdocs.plugins import BasePlugin
from mkdocs.config import config_options
import textwrap
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

        # Add MathJax Configuration for LaTeX math
        config['extra_javascript'].append("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js")

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
    # 1. Main Container & Inclusion Rules
    INCLUDE_REGEX = re.compile(r'^\s*@include:\s*(.+)$', flags=re.MULTILINE)
    # QUIZ_BLOCK_REGEX = re.compile(r'@START(.*?)@END', flags=re.DOTALL)
    # QUIZ_BLOCK_REGEX = re.compile(r'(?ms)^\s*@START\s*$\n(.?)\n^\s@END\s*$')
    # QUIZ_BLOCK_REGEX = re.compile(r'(?<!\\)@START\s*(.*?)\s*@END', flags=re.DOTALL | re.IGNORECASE)
    # NEW: Group 1 captures indentation, Group 2 captures content
    # CHANGE THIS LINE in your class definitions:
    # Group 1 (\s*) captures the indentation.
    QUIZ_BLOCK_REGEX = re.compile(r'(?m)^(\s*)@START\s*$\n([\s\S]*?)\n^\s*@END\s*$', flags=re.IGNORECASE)
    
    # 2. Global Metadata & Structural Rules
    QUIZ_META_LINE_REGEX = re.compile(r'^\s*@(\w+)\s*:\s*(.+)$', re.MULTILINE)
    QUIZ_ID_REGEX = re.compile(r'@id:\s*(.+)', flags=re.IGNORECASE)
    QUESTION_SPLIT_REGEX = re.compile(r'(?:^|\n)\s*---\s*(?:\n|$)')
    
    # 3. Specific Question Syntax (Dropdown, Ordering, Matching, Images)
    ANSWER_REGEX = re.compile(r'^\s*\[(x|\s)?\]\s*(.*)', flags=re.MULTILINE)
    DROPDOWN_REGEX = re.compile(r'\{\{(.+?)\}\}')
    ORDER_ITEM_REGEX = re.compile(r'^\s*\((\d+)\.\)\s*(.*)$', flags=re.MULTILINE | re.UNICODE)
    MATCHING_REGEX = re.compile(r'^\s*\{(.+?)\|(.+?)\}', flags=re.MULTILINE)
    IMAGE_REGEX = re.compile(r'!\[(.*?)\]\((.*?)\)')

    # 4. Explanations
    EXPLANATION_REGEX = re.compile(r'^\s*@explanation:\s*(.*)$', flags=re.MULTILINE | re.IGNORECASE)

    def _extract_quiz_meta(self, block_content):
        meta = {}

        # 1. Gather Metadata (Skipping explanation)
        for match in self.QUIZ_META_LINE_REGEX.finditer(block_content):
            key = match.group(1).lower()
            
            if key == 'explanation':
                continue
            value = match.group(2).strip()
            meta[key] = value

        # 2. Clean content (Preserving explanation)
        def replace_meta(match):
            key = match.group(1).lower()
            # If the tag is @explanation, return the original text (do not delete)
            if key == 'explanation':
                return match.group(0)
            # Otherwise, delete the line
            return ''

        cleaned = self.QUIZ_META_LINE_REGEX.sub(replace_meta, block_content)
        return meta, cleaned


    def _render_start_screen(self, meta, total_questions=0):
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
            meta_items.append(f'<span class="quiz-meta-item"> Time: {minutes} seconds</span>')

         # --- Epic #110: Passing Score Pill ---
        if "required_score" in meta:
            score_val = meta["required_score"]
            display_text = f"Passing Score: {score_val}"
            
            # If it's a number, format as X/Y
            if str(score_val).isdigit() and total_questions > 0:
                 display_text = f"Passing Score: {score_val}/{total_questions}"

            # Added class quiz-baseline-pill
            meta_items.append(f'<span class="quiz-meta-item quiz-baseline-pill">{display_text}</span>')
        # ------------------------------------


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
        # Update regex to capture indentation: r'(?m)^(\s*)@include:\s*(.+)$'
        # This ensures we respect the indentation of the @include tag itself
        INCLUDE_REGEX_INDENT = re.compile(r'(?m)^(\s*)@include:\s*(.+)$')

        def replace_include(match):
            include_indent = match.group(1)  # Indentation of the @include line
            raw_args = match.group(2).strip()
            params = {}
            current_key = None

            # 1. Parse Arguments
            for part in raw_args.split(','):
                token = part.strip()
                if not token:
                    continue

                if '=' in token:
                    key, value = token.split('=', 1)
                    current_key = key.strip()
                    params[current_key] = value.strip()
                else:
                    # Support trailing values for id lists
                    if current_key in ('id', 'ids'):
                        existing = params.get(current_key, '')
                        params[current_key] = (existing + ',' + token).strip(', ')
                    else:
                        log.warning(f"[QuizPlugin] Ignoring unrecognized token '{token}' in @include")

            filename = params.get('file', '')
            if not filename:
                return f'<p style="color: red;">Error: file parameter missing</p>'

            # Handle IDs
            id_value = params.get('id', params.get('ids', ''))
            specified_ids = [s.strip() for s in id_value.split(',') if s.strip()] if id_value else []

            current_file_dir = os.path.dirname(page.file.abs_src_path)
            target_file_path = os.path.join(current_file_dir, filename)

            try:
                with open(target_file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Recursive processing
                processed_content = self._process_includes(content, page)

                # Logic for ID Filtering
                if specified_ids:
                    # FIX IS HERE: findall now returns tuples (indent, content)
                    blocks = self.QUIZ_BLOCK_REGEX.findall(processed_content)
                    found_blocks = ""
                    
                    for match_tuple in blocks:
                        # 1. Unpack the tuple
                        if isinstance(match_tuple, tuple):
                            q_indent, q_content = match_tuple
                        else:
                            # Fallback if regex changes again
                            q_indent, q_content = "", match_tuple

                        # 2. Check metadata
                        block_meta, _ = self._extract_quiz_meta(q_content)
                        quiz_id = block_meta.get("id", "").strip()
                        
                        if quiz_id in specified_ids:
                            # 3. Reconstruct the block preserving its original indentation
                            found_blocks += f"{q_indent}@START\n{q_content}\n{q_indent}@END\n"
                    
                    final_content = found_blocks
                
                else:
                    final_content = processed_content

                # Apply the parent @include indentation to the whole result
                if not final_content: return ""
                
                # Strip blank lines to prevent massive gaps, then re-indent
                lines = final_content.strip().split('\n')
                return "\n".join(include_indent + line for line in lines)
                    
            except FileNotFoundError:
                log.warning(f"[QuizPlugin] File not found: {filename}")
                return ""
            except Exception as e:
                log.error(f"[QuizPlugin] Error reading {filename}: {e}")
                return ""
        
        return INCLUDE_REGEX_INDENT.sub(replace_include, markdown)

    def _process_quizzes(self, markdown):
        """
        Finds all quiz blocks (@START...@END) and replaces them with the
        rendered HTML structure, strictly preserving indentation.
        """
        def replace_quiz_block(match):
            indent = match.group(1) # Capture the tab indentation
            block_content = match.group(2)

            # --- HELPER: Flatten HTML to a single line ---
            def _clean_block(text):
                if not text: return ""
                # 1. Split into lines
                # 2. Strip whitespace
                # 3. Filter empty lines
                lines = [line.strip() for line in text.split('\n') if line.strip()]
                # 4. Join with SPACE to make one single long line
                #    This prevents Markdown from inserting <br> or <p> tags.
                return " ".join(lines)

            # 1. Extract Meta-data
            quiz_meta, block_content = self._extract_quiz_meta(block_content)

            # 2. Split into Questions
            if '---' in block_content:
                raw_questions = self.QUESTION_SPLIT_REGEX.split(block_content)
            else:
                raw_questions = [block_content]
            
            questions = [q for q in raw_questions if q.strip()]
            
            # 3. Attributes
            layout_mode = self._normalize_choice(quiz_meta.get("layout"), allowed={"book", "list"}, default="book")
            
            container_attrs = {
                "id": quiz_meta.get("id"),
                "layout": layout_mode,
                "timer": quiz_meta.get("time_limit"),
                "baseline": quiz_meta.get("required_score"),
                "shuffle-questions": self._normalize_choice(quiz_meta.get("shuffle_questions"), allowed={"true", "false"}, default="false"),
                "shuffle-answers": self._normalize_choice(quiz_meta.get("shuffle_answers"), allowed={"true", "false"}, default="true"),
                "feedback-mode": self._normalize_choice(quiz_meta.get("feedback_mode"), allowed={"immediate", "end"}, default="end"),
                "allow-skip": self._normalize_choice(quiz_meta.get("allow_skip"), allowed={"true", "false"}, default="true"),
                "enable-survey": self._normalize_choice(quiz_meta.get("enable_survey"), allowed={"true", "false"}, default="false"),
                "allow-back": quiz_meta.get("allow_back"),
            }

            data_attrs = " ".join(
                f'data-{k}="{v}"' for k, v in container_attrs.items() if v is not None and v != ""
            )

            # 4. Assemble HTML List
            html_parts = []
            
            html_parts.append(f'<div class="quiz-container" {data_attrs}>')
            
            # Clean the Start Screen HTML
            start_screen_html = self._render_start_screen(quiz_meta, total_questions=len(questions))
            html_parts.append(_clean_block(start_screen_html))
            
            html_parts.append('<div class="quiz-main-wrapper" style="display: none;">')
            
            # Clean the Header HTML
            html_parts.append(_clean_block("""
                <div class="quiz-header">
                    <div class="quiz-timer-display">
                        Time Left: <span id="time-display"></span>
                    </div>
                    <div class="quiz-progress-container">
                        <div class="quiz-progress-bar"></div>
                    </div>
                    <span class="quiz-status-text"></span>
                </div>
            """))
            
            for index, q_text in enumerate(questions):
                q_html = self._render_single_question(q_text, index, layout=layout_mode)
                html_parts.append(_clean_block(q_html))

            # Clean Navigation HTML
            html_parts.append(_clean_block('''
                <div class="quiz-navigation">
                    <button class="quiz-nav-previous" style="display: none;">Previous</button>  
                    <span class="quiz-status-text"></span>
                    <button class="quiz-nav-next">Next</button>
                    <button class="quiz-nav-submit">Submit</button>
                </div>
            '''))
            
            html_parts.append('<div class="quiz-results"></div>')

            # Clean Retake Button HTML
            html_parts.append(_clean_block('''
                <div class="quiz-retake-container" style="text-align: center; margin-top: 20px;">
                    <button class="quiz-btn-retake" style="display: none;">Retake Quiz</button>
                </div>
            '''))

            html_parts.append('</div>') # Close wrapper
            html_parts.append('</div>') # Close container

            # --- INDENTATION APPLICATION ---
            # 1. Join all parts into one string (NOW IT IS ONE SINGLE LINE)
            full_html_string = "".join(html_parts)
            
            # 2. Add the Tab indentation to the start
            return indent + full_html_string

        return self.QUIZ_BLOCK_REGEX.sub(replace_quiz_block, markdown)  
    def _extract_explanation(self, question_text):
        """
        Searches for @explanation: directive in question text.
        Returns: (cleaned_text, explanation_content)
        - cleaned_text: question text with @explanation line removed
        - explanation_content: the explanation markdown or None
        """
        match = self.EXPLANATION_REGEX.search(question_text)
        
        if match:
            explanation_content = match.group(1).strip()
            # Remove the entire @explanation line from the question text
            cleaned_text = self.EXPLANATION_REGEX.sub('', question_text)
            return cleaned_text, explanation_content
        
        return question_text, None

    def _render_single_question(self, text, index, layout='book'):
        text, explanation = self._extract_explanation(text)

        def replace_image(match):
            safe_alt = html.escape(match.group(1)) 
            src_url = match.group(2) 
            return f'<br><img src="{src_url}" alt="{safe_alt}" class="quiz-image">'

        lines = text.strip().split('\n')
        question_text_parts = []
        answers_html = []
        order_items = []
        match_pairs = []
        correct_answer_count = 0
        
        # --- PARSING PHASE ---
        for line in lines:
            line = line.strip()
            if not line: continue
            normalized_line = line.replace('\xa0', ' ')
            
            # Check for Matching {A|B}
            matching_match = self.MATCHING_REGEX.match(normalized_line)
            if matching_match:
                left_text = html.escape(matching_match.group(1).strip())
                right_text = html.escape(matching_match.group(2).strip())
                pair_id = f"{len(match_pairs)}"
                match_pairs.append((left_text, right_text, pair_id))
                continue
                
            # Check for Ordering Item: (1.) Item Text
            order_match = self.ORDER_ITEM_REGEX.match(normalized_line)
            if order_match:
                item_number = int(order_match.group(1))
                item_raw_text = order_match.group(2).strip()
                
                # 1. Escape the text for security
                item_html = self._safe_math_escape(item_raw_text)
                # 2. Re-insert images safely
                if self.IMAGE_REGEX.search(item_raw_text):
                    for m in self.IMAGE_REGEX.finditer(item_raw_text):
                        safe_alt = html.escape(m.group(1))
                        img_tag = f'<br><img src="{m.group(2)}" alt="{safe_alt}" class="quiz-image">'
                        item_html = item_html.replace(html.escape(m.group(0)), img_tag)
                
                order_items.append((item_number, item_html))
                continue

            # Check for Standard Answers: [x] Correct or [ ] Incorrect
            ans_match = self.ANSWER_REGEX.match(line)
            if ans_match:
                is_correct_str = "true" if ans_match.group(1) == 'x' else "false"
                if is_correct_str == "true": correct_answer_count += 1
                
                ans_raw_text = ans_match.group(2).strip()
                # 1. Escape for security
                ans_html_text = self._safe_math_escape(ans_raw_text)
                # 2. Re-insert images safely
                if self.IMAGE_REGEX.search(ans_raw_text):
                    for m in self.IMAGE_REGEX.finditer(ans_raw_text):
                        safe_alt = html.escape(m.group(1))
                        img_tag = f'<br><img src="{m.group(2)}" alt="{safe_alt}" class="quiz-image">'
                        ans_html_text = ans_html_text.replace(html.escape(m.group(0)), img_tag)
                
                answers_html.append(f'<button class="quiz-answer" data-correct="{is_correct_str}">{ans_html_text}</button>')
            else:
                question_text_parts.append(line)

        # question
        raw_question_body = " ".join(question_text_parts)
        full_question_text = self._safe_math_escape(raw_question_body)
        
        # Safely re-insert images into the escaped question body
        if self.IMAGE_REGEX.search(raw_question_body):
            for m in self.IMAGE_REGEX.finditer(raw_question_body):
                safe_alt = html.escape(m.group(1))
                img_tag = f'<br><img src="{m.group(2)}" alt="{safe_alt}" class="quiz-image">'
                full_question_text = full_question_text.replace(html.escape(m.group(0)), img_tag)
        
        # --- DROPDOWN PROCESSING ---
        # Only process dropdowns if we aren't doing an ordering question
        has_dropdown = False
        if not order_items:
            def replace_dropdown(match):
                content = match.group(1)
                raw_options = content.split('|')
                
                select_html = ['<select class="quiz-dropdown">']
                select_html.append('<option disabled selected>Choose...</option>')
                
                for i, opt in enumerate(raw_options):
                    safe_text = html.escape(opt.strip())
                    is_correct = "true" if i == 0 else "false"
                    select_html.append(f'<option data-correct="{is_correct}">{safe_text}</option>')
                    
                select_html.append('</select>')
                return "".join(select_html)

            # Check if dropdown exists before replacing to set flag
            if self.DROPDOWN_REGEX.search(full_question_text):
                has_dropdown = True
                full_question_text = self.DROPDOWN_REGEX.sub(replace_dropdown, full_question_text)

        explanation_html = ""
        if explanation:
            # Store explanation as markdown, hidden by default
            # JavaScript will reveal this in the report
            explanation_html = f'''
            <div class="quiz-explanation" style="display: none;" data-explanation-markdown="{self._escape_html_attr(explanation)}">
                <div class="quiz-explanation-content">{explanation}</div>
            </div>
            '''

        # --- HTML GENERATION ---

        if layout == 'list':
            display_style = ''
        else:
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
                <button class="quiz-btn-check-answer" style="display: none;">Check Answer</button>
                {explanation_html}
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
                <button class="quiz-btn-check-answer" style="display: none;">Check Answer</button>
                {explanation_html}
            </div>
            '''

        # Dropdown Question
        if has_dropdown:
            return f'''
            <div class="quiz-question-block" data-question-index="{index}" data-type="dropdown"{display_style}>
                <p class="quiz-question">{full_question_text}</p>
                <button class="quiz-btn-check-answer" style="display: none;">Check Answer</button>
                {explanation_html}
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
            <button class="quiz-btn-check-answer" style="display: none;">Check Answer</button>
            {explanation_html}        
        </div>
        '''
    def _escape_html_attr(self, text):
        """Escape text for safe inclusion in HTML attribute values."""
        if not text: return ""
        return (text
                .replace('&', '&amp;')
                .replace('"', '&quot;')
                .replace("'", '&#39;')
                .replace('<', '&lt;')
                .replace('>', '&gt;')
                .replace('\n', '&#10;')) # <--- ADD THIS LINE
    
    def _safe_math_escape(self, text):
        """Escapes HTML but preserves backslashes for MathJax."""
        if not text:
            return ""
            
        # 1. Perform standard escape
        escaped = html.escape(text)
        # 2. Re-convert the double-escaped ampersands back to single backslashes 
        return escaped.replace("&amp;\\", "\\").replace("&#x27;", "'")
