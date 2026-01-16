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

2.  **Create a new project**

    In the IDE terminal, automatically create a new project using the command:
    ```
    mkdocs new ProjectName
    ```

3.  **Enable the plugin**

    Add the plugin to your `mkdocs.yml` file. This enables the plugin for your project:
    ```yaml
    plugins:
      - quiz
    ```


4.  **Start writing quizzes**

    You can now start adding quiz blocks to your Markdown files.

5.  **Preview your site**

    Use the `mkdocs serve --livereload` command to start the live-reloading server and see your quizzes rendered in real-time:
    ```bash
    mkdocs serve
    ```

### Writing your first quiz 

**Important notes**

!!! Tags
    The only mandatory tags for a quiz to exist are ``` @START ``` and ``` @END ```.

!!! Answers
    The [x] marks a correct answer.
    <br>
    The [ ] marks an incorrect answer.

!!! Sepparation
    Sepparation between questions in a quiz is made by adding  ``` --- ```
 

<br>
<br>

**Key words defining Quiz Behaviour**

The following keywords can be used to control the behavior of the quiz.

| Keyword                 | Description                                                                                             | Default / Behavior                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `@START` / `@END`       | Marks the beginning and end of the interactive quiz block.                                              | N/A                                               |
| `@id: <unique_name>`      | Assigns a unique identifier to a quiz instance, essential for referencing specific quizzes.             | N/A                                               |
| `@include: file=file_name,  id=quiz_id` | Imports a specific quiz from an external file for reusability.                                          | N/A                                               |
| `@title: <text>`        | Sets the main header for the quiz.                                                                      | Hidden if not provided.                           |
| `@description: <text>`  | Sets the introductory instructions for the quiz.                                                        | Hidden if not provided.                           |
| `@layout: <list/book>`  | Defines the quiz layout. `list` shows all questions vertically, `book` shows one question per slide.      | `book`                                            |
| `@feedback_mode: <end/immediate>` | `immediate` shows results after each question, `end` reveals results only upon final submission. | `end`                                             |
| `@shuffle_questions: <true/false>` | Randomizes the order of questions to prevent memorization.                                   | `false`                                           |
| `@time_limit: <seconds>` | Sets a countdown timer in seconds.                                                                      | Hidden if not provided.                           |
| `@allow_back: <true/false>` | Allows the user to go back to previous questions.                                                     | `true`                                            |
| `@explanation: <text>`  | Provides context for the correct answer during feedback.                                                | N/A                                               |


!!! Note
    All parameters are global, except ``` @explanation ``` which is applied individually to each question.

<br>
<br>

**Quiz Types**

The quiz supports several types of questions:


*   **Single Choice:** The user can select only one correct answer.

=== "Code"

    ```
    ‎@START
    @title: Single Choice Quiz

    What is the command to install mkdocs?

    [] pip install mkdocs-quiz-plugin
    [x] pip install mkdocs
    [] pip install python

    @END
    ```


=== "Rendered Quiz"

    @START
    @title: Single Choice Quiz

    What is the command to install mkdocs?
    [] pip install mkdocs-quiz-plugin
    [x] pip install mkdocs
    [] pip install python

    @END


<br>

*   **Multiple Choice:** The user can select multiple correct answers.

=== "Code"

    ```
    ‎@START
    @title: Multiple Choice Quiz

    Which are the challanges in modern learning?
    [] Poorly structured materials
    [x] Passive reading
    [] No feedback possibility
    [x] Lack of interactive content

    @END
    ```

=== "Rendered Quiz"

    @START
    @title: Multiple Choice Quiz

    Which are the challanges in modern learning?
    [] Poorly structured materials
    [x] Passive reading
    [] No feedback possibility
    [x] Lack of interactive content

    @END

<br>

*   **Dropdown:** The user selects the correct answer from a dropdown menu.

>* Note: The first answer in the list is automatically considered as the correct one!

=== "Code"

    ```
    ‎@START
    @title: Dropdown Quiz

    The octopus has {{3|1|4|8}} hearts.

    @END
    ```

=== "Rendered Quiz"

    @START
    @title: Dropdown Quiz
    The octopus has {{3|1|4|8}} hearts.
    @END

<br>

*   **Ordering:** The user must arrange items in the correct order.

=== "Code"

    ```
    ‎@START
    @title: Correct Order Quiz

    (1.) Crack two fresh eggs into a small bowl and whisk them.
    (2.) Place a skillet over medium-low heat and add a knob of butter.
    (3.) Pour the whisked egg mixture into the center of the pan.
    (4.) Gently push the eggs across the skillet with a spatula to form soft curds.
    (5.) Remove the pan from the heat while the eggs are still slightly soft and moist.

    @END
    ```

=== "Rendered Quiz"

    @START
    @title: Correct Order Quiz

    (1.) Crack two fresh eggs into a small bowl and whisk them.
    (2.) Place a skillet over medium-low heat and add a knob of butter.
    (3.) Pour the whisked egg mixture into the center of the pan.
    (4.) Gently push the eggs across the skillet with a spatula to form soft curds.
    (5.) Remove the pan from the heat while the eggs are still slightly soft and moist.

    @END

<br>

*   **Matching:** The user must match items from two lists.

=== "Code"
    ```
    ‎@START
    @title: Matching Quiz

    Match the painter with the artwork:

    {Leonardo da Vinci | Mona Lisa}
    {Vincent van Gogh | The Starry Night}
    {Pablo Picasso | Guernica}
    {Frida Kahlo | The Two Fridas}

    @END
    ```

=== "Rendered Quiz"

    @START
    @title: Matching Quiz

    Match the painter with the artwork:

    {Leonardo da Vinci | Mona Lisa}
    {Vincent van Gogh | The Starry Night}
    {Pablo Picasso | Guernica}
    {Frida Kahlo | The Two Fridas}

    @END

<br>

*   **Picture Questions:**

    Pictures can be added like in a usual markdown file via URL or relative path (for loacal images):

=== "URL"
    ```bash
    ![SomePicture](https://link)
    ```

=== "Relative path"
    ```bash
    ![SomePicture](../subfolder/image.png)
    ```

<br>
Here is an example of using images in a quiz:

=== "Code"
    ```
    ‎@START
    @title: Picture Quiz

    Identify the object shown below:
    ![SomePicture](https://lafeber.com/vet/wp-content/uploads/european-rabbit.jpg)
    [x] Rabbit
    [] Horse
    [] Cat

    @END
    ```

=== "Rendered Quiz"

    @START
    @title: Picture Quiz
    Identify the object shown below:
    ![SomePicture](https://lafeber.com/vet/wp-content/uploads/european-rabbit.jpg)
    [x] Rabbit
    [] Horse
    [] Cat

    @END

 
## Features

###Referencing and Explanations

**Explanations**

You can add explanations to each quiz question using a simple syntax. To include an explanation, write:

```
@explanation: Actual markdown text for the explanation. This is an explanation.
```

@START
@title: Explanations first example 

Which of the following is not a position in football/soccer?
[ ] Goal defense
[x] Left midfielder
[ ] Right fullback
[ ] Centre back
@explanation: This is a simple explanation.

@END

<br>
<br>

**Referencing Lecture Material**

>* Questions can link directly to lecture notes
>* Using standard Markdown links
>* Students can jump directly to the relevant explanation.

**Reference to headers**

Headings automatically create anchors. Anchors are in lowercase letters and dash-separated.

=== "Linking to the same file"
    Planets Lecture: 
    ```
    ##Order of the planets
    The planets orbit the Sun in a fixed order.
    ```

    Quiz explanation:
    ```
    @explanation: 
    See list of the planets [here](#order-of-the-planets)
    ```

=== "Linking to another file"
    Football Lecture: lecture_notes.md
    ```
    ##Football positions
    There are a lot of footbal positions.
    ```

    Quiz explanation:
    ```
    @explanation: 
    See the football positions [here](lecture_notes.md#football-positions)
    ```

<br>

**Reference to Non-Heading Content**

If you want to link to a specific paragraph or sentence, you must add an explicit anchor using inline HTML:
    ```
    <a id="planet-definition"></a>
    The planets orbit the Sun in a fixed order.
    ```

Then link to it:
    ```
    @explanation: [Planet definition](#planet-definition)
    ```

<br>

**Reference-Style Links**

Useful for longer explanations or repeated links.

```
@explanation: The correct order is explained here [details][planets].
```

Instead of writing the reference in the explanation, you can define it as below: 

```
[planets]: lecture_notes.md#order-of-the-planets
```



###Linking DEMO

Lecture material: 
<a id="order-of-the-planets"></a>
Here is the order of the planets in our solar system, starting from the Sun, along with a popular mnemonic to help you remember them.

Order of the Planets
Mnemonic Phrase: "My Very Educated Mother Just Served Us Noodles."

Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune

@START
@title: Explanations second example

Put the planets in order from the Sun:
(1.) Mercury
(2.) Venus
(3.) Earth
(4.) Mars
@explanation: See [Order of the planets](#order-of-the-planets)
@END


###Multiple Quizzes in Mkdown Files

It is possible to have multiple quizzes in a markdown file. 
Also, we can have multiple markdown files connected, so that the quizzes in one file will be shown when opening the other file. For this, we have:


```
@include: file=additional_quizzes.md, if= id1, id2, …
```

The following quiz was imported from another file:

=== "Code"
    ```
    ‎@include: file=index.md,  id=comprehensive-math-science-quiz
    ```

=== "Rendered quiz"
    @include: file=index.md,  id=comprehensive-math-science-quiz

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

>* Q: How do I include images in my quiz questions?

 You can include images using standard Markdown syntax ``` ![alt text](image_url) ``` anywhere in your question text, answer options, or ordering items. The plugin will automatically render these images.


>* Q: Can I create math equations in my quizzes?

 Yes! The plugin includes MathJax support for LaTeX math notation. Use ``` $...$ ``` for inline math and ``` $$...$$ ``` or ``` \[...\] ``` for display math.


>* Q: How do I reuse the same quiz in multiple places?

 Use the ``` @include: ``` directive with the file path to include quizzes from external files. You can also use ``` @id: ``` to reference specific quizzes within included files.


>* Q: What happens if I don't specify a layout?

 If you don't specify a layout with ``` @layout: ```, the quiz will default to "book" mode, showing one question at a time with navigation buttons.


>* Q: Can I customize the appearance of the quizzes?

 Yes, the plugin includes a CSS file (quiz.css) that you can modify to change colors, fonts, spacing, and other visual aspects. The plugin supports both light and dark themes.


>* Q: How do I enable immediate feedback for each question?

 Set ``` @feedback_mode: ``` immediate in your quiz metadata. This will show whether each answer is correct immediately after answering.


>* Q: Can students skip questions?

 By default, yes (@allow_skip: true). If you want to require answers to all questions, set ``` @allow_skip: false ```


>* Q: What happens if the timer runs out?

 When the time limit expires, the quiz will automatically submit with whatever answers have been completed so far.


>* Q: What file formats are supported for images?

 The plugin supports all standard web image formats (PNG, JPG, GIF, SVG) via URLs or base64 encoded data URLs.


>* Q: Can I use this plugin with other MkDocs plugins?

 Yes, the quiz plugin is designed to work alongside other MkDocs plugins. Just add it to your plugins: list in ``` mkdocs.yml ```


>* Q: How do I report bugs or request features?

 Please check the project repository for issue tracking and contribution guidelines. You can also contact the development team through the channels specified in the project documentation.


>* Q: Is there a way to track quiz results or scores?

 The current version shows scores and results to the user within the browser, but does not include backend tracking. For advanced analytics, you would need to implement custom JavaScript.


>* Q: Can I use the plugin without a timer?

 Yes, simply omit the @time_limit: directive. The timer display will be hidden.
