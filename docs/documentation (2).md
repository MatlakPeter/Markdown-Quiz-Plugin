# Project Documentation

## Introduction

This project is a quiz plugin that allows users to create and take quizzes using a simple Markdown-like syntax.

The MkDocs Quiz Plugin transforms static documentation into engaging, interactive learning experiences through diverse question formats.

It addresses key challenges in modern documentation: it transforms passive reading into active learning, provides immediate verification and enables interactive content creation without technical expertise.


## Getting Started


Follow these steps to get the quiz plugin up and running in your MkDocs project.

### Prerequisites

Before you begin, ensure you have the following installed:

>*   Python 3.8 or higher
>*   MkDocs 1.0 or higher

You can install MkDocs using pip if you don't have it already:
```bash
pip install mkdocs
```

### Installation & Setup

1.  **Install the plugin**

    Install the `mkdocs-quiz-plugin` package from TestPyPI using pip:
    ```bash
    pip install -i https://test.pypi.org/simple/ mkdocs-quiz-plugin
    ```

2.  **Enable the plugin**

    Add the plugin to your `mkdocs.yml` file. This enables the plugin for your project:
    ```yaml
    plugins:
      - quiz
    ```

3.  **Start writing quizzes**

    You can now start adding quiz blocks to your Markdown files.

4.  **Preview your site**

    Use the `mkdocs serve` command to start the live-reloading server and see your quizzes rendered in real-time:
    ```bash
    mkdocs serve
    ```

## Configuration


### Key words defining Quiz Behaviour

The following keywords can be used to control the behavior of the quiz.

| Keyword                 | Description                                                                                             | Default / Behavior                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `@START` / `@END`       | Marks the beginning and end of the interactive quiz block.                                              | N/A                                               |
| `@id: <unique_name>`      | Assigns a unique identifier to a quiz instance, essential for referencing specific quizzes.             | N/A                                               |
| `@include: <file_path>` | Imports a specific quiz from an external file for reusability.                                          | N/A                                               |
| `@title: <text>`        | Sets the main header for the quiz.                                                                      | Hidden if not provided.                           |
| `@description: <text>`  | Sets the introductory instructions for the quiz.                                                        | Hidden if not provided.                           |
| `@layout: <list/book>`  | Defines the quiz layout. `list` shows all questions vertically, `book` shows one question per slide.      | `book`                                            |
| `@feedback_mode: <end/immediate>` | `immediate` shows results after each question, `end` reveals results only upon final submission. | `end`                                             |
| `@shuffle_questions: <true/false>` | Randomizes the order of questions to prevent memorization.                                   | `false`                                           |
| `@shuffle_answers: <true/false>` | Randomizes the order of answer options.                                                         | `true`                                            |
| `@time_limit: <minutes>` | Sets a countdown timer in minutes.                                                                      | Hidden if not provided.                           |
| `@time_limit_seconds: <seconds>` | Alternative to `time_limit` for shorter quizzes, specified in seconds.                          | Hidden if not provided.                           |
| `@allow_back: <true/false>` | Allows the user to go back to previous questions.                                                     | `true`                                            |
| `@allow_skip: <true/false>` | Determines if questions can be left unanswered.                                                       | `true`                                            |
| `@enable_survey: <true/false>` | Toggles a mini-feedback form for students after the quiz.                                         | `false`                                           |
| `@explanation: <text>`  | Provides context for the correct answer during feedback.                                                | N/A                                               |
| `@reference: <anchor_id>` | Creates a 'Go to definition' link to jump to relevant lecture notes.                                    | N/A                                               |

### Referencing and Explanations

You can add explanations to each quiz question using a simple syntax. To include an explanation, write:

```
@explanation: Actual markdown text for the explanation. This is an explanation.
```

You can also include a reference to the relevant section of the lecture material, so students can jump directly to where the answer is explained. When the student clicks the reference link in the quiz, they will be taken directly to the marked location in the lecture material. This requires adding a reference label both in the quiz question and in the lecture material.

In the quiz question body:

```
@reference: reference_label
```

In the lecture material (markdown file):

```
Random text. %reference_label% The explanation starts with this sentence. And the text here goes on.
```

## Features

### Quiz Types

The quiz supports several types of questions:

*   **Single Choice:** The user can select only one correct answer.

@START
@title: My Documentation Quiz

---

What is the command to install mkdocs?
[] pip install mkdocs-quiz-plugin
[x] pip install mkdocs
[] pip install python

@END


*   **Multiple Choice:** The user can select multiple correct answers.
*   **Dropdown:** The user selects the correct answer from a dropdown menu.
*   **Ordering:** The user must arrange items in the correct order.
*   **Matching:** The user must match items from two lists.
*   **Picture Questions:** Questions that include images.

## FAQ

**Q: How do I add a new question?**

A: You can add a new question by separating it with `---` in the markdown file.

**Q: Can I use this for commercial purposes?**

A: Please refer to the license agreement for usage rights.
