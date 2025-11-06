from setuptools import setup, find_packages

setup(
    name='mkdocs-quiz-plugin',
    version='0.1.0',
    description='A simple MkDocs plugin to insert a custom HTML component.',
    author='Your Name',
    
    # This tells setuptools to find your Python files.
    # We specify 'plugin' as a simple "module".
    py_modules=['plugin'], 
    
    # These are the dependencies your plugin needs to run.
    # MkDocs is the only one for this simple case.
    install_requires=[
        'mkdocs>=1.0'
    ],
    
    # This is the most important part!
    # It tells MkDocs that your plugin exists.
    entry_points={
        'mkdocs.plugins': [
            'quiz = plugin:QuizPlugin',
        ]
    }
)