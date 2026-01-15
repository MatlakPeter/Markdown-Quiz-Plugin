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

### Writing your first quizz

**Key words defining Quiz Behaviour**

>* The following keywords can be used to control the behavior of the quiz.
>* The only mandatory tags for a quiz to exist are @START and @END. 

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


**Quiz Types**

The quiz supports several types of questions:


*   **Single Choice:** The user can select only one correct answer.

=== "Code"

    ![Single Choice code](../screenshots/singleChoice.png)

=== "Rendered Quiz"

    @START
    @title: Single Choice Quiz

    What is the command to install mkdocs?
    [] pip install mkdocs-quiz-plugin
    [x] pip install mkdocs
    [] pip install python

    @END


*   **Multiple Choice:** The user can select multiple correct answers.

@START
@title: Multiple Choice Quiz
Which are the challanges in modern learning?
[] Poorly structured materials
[x] Passive reading
[] No feedback possibility
[x] Lack of interactive content

@END


*   **Dropdown:** The user selects the correct answer from a dropdown menu.

>* Note: The first answer in the list is automatically considered as the correct one!

@START
@title: Dropdown Quiz
The octopus has {{3|1|4|8}} hearts.
@END

*   **Ordering:** The user must arrange items in the correct order.

@START
@title: Correct Order Quiz
(1.) Crack two fresh eggs into a small bowl and whisk them thoroughly with a pinch of salt and pepper.

(2.) Place a non-stick skillet over medium-low heat and add a knob of butter, allowing it to melt and coat the surface.

(3.) Pour the whisked egg mixture into the center of the pan and let it sit undisturbed for a few seconds until the edges begin to set.

(4.) Gently push the eggs across the skillet with a spatula to form soft curds, allowing the uncooked portions to flow onto the hot surface.

(5.) Remove the pan from the heat while the eggs are still slightly soft and moist, as the residual heat will finish cooking them.
@END

*   **Matching:** The user must match items from two lists.

@START
@title: Matching Quiz

Match the painter with the artwork

{Leonardo da Vinci | Mona Lisa}

{Vincent van Gogh | The Starry Night}

{Pablo Picasso | Guernica}

{Frida Kahlo | The Two Fridas}

@END

*   **Picture Questions:** Questions that include images.

@START
@title: Picture Quiz
Identify the object shown below:
![SomePicture](https://lafeber.com/vet/wp-content/uploads/european-rabbit.jpg)
[x] Rabbit
[] Horse
[] Cat

@END


## Features

**Referencing and Explanations**

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

**Multiple Quizzes in Mkdown Files**

It is possible to have multiple quizzes in a markdown file. 
Also, we can have multiple markdown files connected, so that the quizzes in one file will be shown when opening the other file. For this, we have:


```@include: additional_quizzes.md, id1, id2, … syntax.
```

The following quiz was imported from another file:

@include: quizzes.md, 1

##Contributions

We welcome contributions from the community! If you're interested in improving the MkDocs Quiz Plugin, here’s how you can get started:

### Setting Up Your Development Environment

1.  **Fork the repository** on GitHub to create your own copy.
2.  **Clone your fork** to your local machine:
    ```bash
    git clone https://github.com/username_PLACEHOLDER/markdown-quizzes.git
    cd markdown-quizzes
    ```
3.  **Set up a virtual environment** and install the dependencies. This project uses `pip` for package management.

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -e .
    ```

### Making Changes

1.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b your-feature-name
    ```
2.  **Make your changes** to the source code in the `quiz_plugin/` directory.
3.  **Test your changes** by running the local MkDocs server with `mkdocs serve` and creating a sample quiz in the `docs/` directory.

### Submitting a Pull Request

Once you're happy with your changes, push your branch to your fork and open a pull request. Please provide a clear description of the changes you've made and why they are valuable.

We appreciate your help in making this plugin better!


## FAQ

**Q: How do I include images in my quiz questions?**

 You can include images using standard Markdown syntax ![alt text](image_url) anywhere in your question text, answer options, or ordering items. The plugin will automatically render these images.


**Q: Can I create math equations in my quizzes?**

 Yes! The plugin includes MathJax support for LaTeX math notation. Use $...$ for inline math and $$...$$ or \[...\] for display math.


**Q: How do I reuse the same quiz in multiple places?**

 Use the @include: directive with the file path to include quizzes from external files. You can also use @id: to reference specific quizzes within included files.


**Q: What happens if I don't specify a layout?**

 If you don't specify a layout with @layout:, the quiz will default to "book" mode, showing one question at a time with navigation buttons.


**Q: Can I customize the appearance of the quizzes?**

 Yes, the plugin includes a CSS file (quiz.css) that you can modify to change colors, fonts, spacing, and other visual aspects. The plugin supports both light and dark themes.


**Q: How do I enable immediate feedback for each question?**

 Set @feedback_mode: immediate in your quiz metadata. This will show whether each answer is correct immediately after answering.


**Q: What's the difference between time_limit and time_limit_seconds?**

 Both set a timer for the quiz. @time_limit: expects minutes, while @time_limit_seconds: expects seconds. Use whichever is more convenient for your quiz duration.


**Q: Can students skip questions?**

 By default, yes (@allow_skip: true). If you want to require answers to all questions, set @allow_skip: false.


**Q: How do I add explanations to questions?**

 Use @explanation: followed by your explanation text. This will appear when students review their answers or when immediate feedback is enabled.


**Q: What happens if the timer runs out?**

 When the time limit expires, the quiz will automatically submit with whatever answers have been completed so far.


**Q: Can I randomize both questions and answers?**

 Yes! Use @shuffle_questions: true to randomize question order and @shuffle_answers: true to randomize answer order within each question.


**Q: How do I reference specific parts of lecture materials?**

 Use @reference: label_name in your quiz question and mark the corresponding location in your lecture notes with %label_name%.


**Q: What file formats are supported for images?**

 The plugin supports all standard web image formats (PNG, JPG, GIF, SVG) via URLs or base64 encoded data URLs.


**Q: Can I use this plugin with other MkDocs plugins?**

 Yes, the quiz plugin is designed to work alongside other MkDocs plugins. Just add it to your plugins: list in mkdocs.yml.


**Q: How do I report bugs or request features?**

 Please check the project repository for issue tracking and contribution guidelines. You can also contact the development team through the channels specified in the project documentation.


**Q: Is there a way to track quiz results or scores?**

 The current version shows scores and results to the user within the browser, but does not include backend tracking. For advanced analytics, you would need to implement custom JavaScript.


**Q: Can I use the plugin without a timer?**

 Yes, simply omit the @time_limit: or @time_limit_seconds: directive. The timer display will be hidden.


**Q: How do I create a matching question?**

 Use the syntax {left_item|right_item} for each matching pair, with all pairs listed in the question block. The left and right items will be automatically shuffled.