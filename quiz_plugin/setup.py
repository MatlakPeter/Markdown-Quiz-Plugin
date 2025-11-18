from setuptools import setup, find_packages

setup(
    name='mkdocs-quiz-plugin', # Package name (for pip)
    version='0.1.0',  # Version number
    description='A simple MkDocs plugin to insert a custom HTML component.', # What the  plugin does
    author='Peter',

    packages=find_packages(), # Finds all Python packages in this directory

    # These are the dependencies the plugin needs to run.
    # MkDocs is the only one for this simple case.
    install_requires=[ # Dependencies the plugin needs 
        'mkdocs>=1.0'
    ],
    # This is the most important part!
    # It tells MkDocs that your plugin exists.
    entry_points={
        'mkdocs.plugins': [
            'quiz = quiz_plugin.plugin:QuizPlugin', 
            # ^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            # |     |
            # |     Where MkDocs finds the plugin class
            # Plugin name used in mkdocs.yml
        ]
    }
)