from setuptools import setup, find_packages

setup(
    name='mkdocs-quiz_plugin',
    version='0.1.0',
    description='A simple MkDocs plugin to insert a custom HTML component.',
    author='Your Name',
    packages=find_packages(),
    package_data={
        'quiz_plugin': ['assets/*'],
    },
    include_package_data=True,
    install_requires=[
        'mkdocs>=1.0'
    ],
    entry_points={
        'mkdocs.plugins': [
            'quiz = quiz_plugin.plugin:QuizPlugin',
        ]
    }
)