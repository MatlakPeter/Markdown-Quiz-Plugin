import os
import shutil
import re
from mkdocs.plugins import BasePlugin
from mkdocs.config import config_options

QUESTION_REGEX = re.compile(
    r'^::question::(.*?)$',
    flags=re.MULTILINE | re.DOTALL
)
ANSWER_REGEX = re.compile(
    r'^\s*\[( |x)\]\s*(.*)',
    flags=re.MULTILINE
)

class QuizPlugin(BasePlugin):
    # Define configuration options if you need them later
    config_scheme = (
        ('enabled', config_options.Type(bool, default=True)),
    )

    def on_config(self, config):
        """
        Event: Runs when MkDocs reads the configuration.
        Action: Inject our CSS and JS into the site configuration so the theme uses them.
        """
        if not self.config['enabled']:
            return config

        # Tell MkDocs to link these files in the <head>
        # Note: We use a specific prefix ('assets/') to keep things organized
        config['extra_css'].append('assets/quiz.css')
        config['extra_javascript'].append('assets/quiz.js')

        return config

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

    def on_post_build(self, config):
        """
        Event: Runs after the site is built.
        Action: Copy our static assets from the plugin package to the site directory.
        """
        if not self.config['enabled']:
            return

        # 1. Find the path to our assets inside this python package
        # __file__ is the path to this script (plugin.py)
        current_dir = os.path.dirname(__file__)
        assets_source_dir = os.path.join(current_dir, 'assets')

        # 2. Define where they should go in the built site
        # config['site_dir'] is usually the 'site/' folder
        assets_dest_dir = os.path.join(config['site_dir'], 'assets')

        # 3. Ensure the destination directory exists
        os.makedirs(assets_dest_dir, exist_ok=True)

        # 4. Copy CSS and JS files
        for filename in os.listdir(assets_source_dir):
            if filename.endswith('.css') or filename.endswith('.js'):
                src_file = os.path.join(assets_source_dir, filename)
                dst_file = os.path.join(assets_dest_dir, filename)
                shutil.copyfile(src_file, dst_file)



