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

2.  **Open existing project / Create a new project**

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


#### Step 1: The Simplest Quiz

Let's create your first quiz step by step! Every quiz requires **only two tags to exist**: a start tag and an end tag. See the example below:

=== "Code"
    ```
    ‎@START
    
    What is 2 + 2?
    [ ] 3
    [x] 4
    [ ] 5
    
    @END
    ```

=== "Rendered Quiz"
    @START
    
    What is 2 + 2?
    [ ] 3
    [x] 4
    [ ] 5
    
    @END

!!!Explanation
    * `@START` and `@END` mark where your quiz begins and ends
    * Write your question as plain text
    * Use `[x]` to mark the **correct** answer
    * Use `[ ]` to mark **incorrect** answers (the space is optional)

Congratulations, you've created your first quiz! Try copying this into a markdown file and running `mkdocs serve` to see it in action.

#### Step 2: Adding Title

Make your quiz more professional by adding a title:

=== "Code"
    ```
    ‎@START
    @title: Math Basics Quiz
    
    What is 2 + 2?
    [ ] 3
    [x] 4
    [ ] 5
    
    @END
    ```

=== "Rendered Quiz"
    @START
    @title: Math Basics Quiz
    
    What is 2 + 2?
    [ ] 3
    [x] 4
    [ ] 5
    
    @END

The `@title:` keyword adds a header above your quiz. This is optional but recommended for clarity.

#### Step 3: Multiple Questions

Add more questions by separating them with `---`:

=== "Code"
    ```
    ‎@START
    @title: Math Basics Quiz
    
    What is 2 + 2?
    [ ] 3
    [x] 4
    [ ] 5
    
    ---
    
    What is 3 × 3?
    [ ] 6
    [ ] 8
    [x] 9
    
    @END
    ```

=== "Rendered Quiz"
    @START
    @title: Math Basics Quiz
    
    What is 2 + 2?
    [ ] 3
    [x] 4
    [ ] 5
    
    ---
    
    What is 3 × 3?
    [ ] 6
    [ ] 8
    [x] 9
    
    @END

!!! Remember
    Use `---` on its own line to separate questions.

#### Step 4: Multiple Correct Answers

Sometimes questions have more than one correct answer. Just mark multiple options with `[x]`:

=== "Code"
    ```
    ‎@START
    @title: Programming Languages
    
    Which of these are programming languages? (Select all that apply)
    [x] Python
    [x] JavaScript
    [ ] HTML
    [x] Java
    [ ] CSS
    
    @END
    ```

=== "Rendered Quiz"
    @START
    @title: Programming Languages
    
    Which of these are programming languages? (Select all that apply)
    [x] Python
    [x] JavaScript
    [ ] HTML
    [x] Java
    [ ] CSS
    
    @END

#### Step 5: Customizing Your Quiz

You can customize how your quiz behaves using keywords. Here are the most useful ones:

**Show all questions at once:**
```
@layout: list
```

**Show feedback immediately after each answer:**
```
@feedback_mode: immediate
```

**Add a timer (in seconds):**
```
@time_limit: 60
```

**Add instructions:**
```
@description: Complete all questions to test your knowledge.
```

Here's a complete example with customizations:

=== "Code"
    ```
    ‎@START
    @title: Quick Knowledge Check
    @description: You have 30 seconds to answer both questions!
    @layout: list
    @feedback_mode: immediate
    @time_limit: 30
    
    What is the capital of France?
    [ ] London
    [x] Paris
    [ ] Berlin
    
    ---
    
    What is 5 × 5?
    [ ] 20
    [x] 25
    [ ] 30
    
    @END
    ```

=== "Rendered Quiz"
    @START
    @title: Quick Knowledge Check
    @description: You have 30 seconds to answer both questions!
    @layout: list
    @feedback_mode: immediate
    @time_limit: 30
    
    What is the capital of France?
    [ ] London
    [x] Paris
    [ ] Berlin
    
    ---
    
    What is 5 × 5?
    [ ] 20
    [x] 25
    [ ] 30
    
    @END

#### Step 6: Other Question Types

The quiz plugin supports several other question types beyond multiple choice:

*   **Dropdown:** The user selects the correct answer from a dropdown menu.

!!! Note
    The first answer in the list is automatically considered as the correct one!

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

    Pictures can be added like in a usual markdown file via URL or relative path (for local images):

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

#### Complete Keyword Reference

For advanced users, here's a complete reference of all available keywords:

| Keyword                 | Description                                                                                             | Default / Behavior                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `@START` / `@END`       | Marks the beginning and end of the interactive quiz block. **Required.**                                 | N/A                                               |
| `@id: <unique_name>`      | Assigns a unique identifier to a quiz instance, essential for referencing specific quizzes.             | N/A                                               |
| `@author: <text>`        | Sets the author or owner of the quiz.                                                                   | Hidden if not provided.                           |
| `@include: file=file_name,  id=quiz_id` | Imports a specific quiz from an external file for reusability.                                          | N/A                                               |
| `@title: <text>`        | Sets the main header for the quiz.                                                                      | Hidden if not provided.                           |
| `@description: <text>`  | Sets the introductory instructions for the quiz.                                                        | Hidden if not provided.                           |
| `@layout: <list/book>`  | Defines the quiz layout. `list` shows all questions vertically, `book` shows one question per slide.      | `book`                                            |
| `@feedback_mode: <end/immediate>` | `immediate` shows results after each question, `end` reveals results only upon final submission. | `end`                                             |
| `@shuffle_questions: <true/false>` | Randomizes the order of questions to prevent memorization.                                   | `false`                                           |
| `@time_limit: <seconds>` | Sets a countdown timer in seconds.                                                                      | Hidden if not provided.                           |
| `@required_score: <number>`  | Sets a minimum score threshold required to "pass" the quiz. | Hidden if not provided.                                            | 
| `@allow_back: <true/false>` | Allows the user to go back to previous questions.                                                     | `true`                                            |
| `@explanation: <text>`  | Provides context for the correct answer during feedback. Applied to individual questions.                                                | N/A                                               |

!!! Note "Individual Parameter"
    All parameters are global (they apply to the entire quiz), except `@explanation` which is applied individually to each question.

 
## Advanced Features

###Referencing and Explanations

!!! Note "How do they work?"
    
    * **Explanations** provide immediate context and feedback when students review their answers
    * **References** link directly to relevant lecture material, allowing students to jump to detailed explanations. They use *standard Markdown links* to connect quiz explanations to headers, paragraphs, or sections in your documentation.

**Explanations**

You can add explanations to each quiz question using a simple syntax. To include an explanation, write:

=== "Code"
    ```
    ‎@START
    @title: Explanations first example 

    Which of the following is not a position in football/soccer?
    [ ] Goal defense
    [x] Left midfielder
    [ ] Right fullback
    [ ] Centre back
    @explanation: This is a simple explanation.

    @END
    ```

=== "Simple Explanation"
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

---

**Reference to headers**

Headings automatically create anchors. Anchors are in lowercase letters and dash-separated. See the example below:

Lecture Notes:

## Python Data Types

Python supports several built-in data types that are fundamental to programming. Understanding these types is crucial for writing effective Python code. The most common types include integers, floats, strings, lists, dictionaries, and booleans. Each type has specific characteristics and use cases that make them suitable for different programming tasks.

<br>

Quiz with Explanation:

=== "HTML Syntax"
    ```
    ‎@START
    @title: Python Basics Quiz

    Which of the following is a Python data type?
    [ ] Function
    [x] Dictionary
    [ ] Loop
    [ ] Class
    @explanation: Review the <a href="#python-data-types">Python Data Types</a> section for more information.
    @END
    ```

=== "Markdown Syntax"
    ```
    ‎@START
    @title: Python Basics Quiz

    Which of the following is a Python data type?
    [ ] Function
    [x] Dictionary
    [ ] Loop
    [ ] Class
    @explanation: Review the [Python Data Types](#python-data-types) section for more information.
    @END
    ```

=== "Rendered Quiz"
    @START
    @title: Python Basics Quiz

    Which of the following is a Python data type?
    [ ] Function
    [x] Dictionary
    [ ] Loop
    [ ] Class
    @explanation: Review the <a href="#python-data-types">Python Data Types</a> section for more information.
    @END


<br>

---

**Reference to Non-Heading Content**

If you want to link to a specific paragraph or sentence, you must add an explicit anchor using inline HTML:

```
<a id="lowercase-dashed-id"></a> When naming variables in Python...
```

Then add a link to it in your quiz explanation using the id of the anchor:

=== "HTML Syntax"
    ```
    @explanation: Learn more about <a href="#lowercase-dashed-id">Displayed text for the link</a>
    ```

=== "Markdown Syntax"
    ```
    @explanation: Learn more about [Displayed text for the link](#lowercase-dashed-id)
    ```
See the example below:

<br>

Lecture Notes

Python has specific conventions for naming variables that help maintain code readability and consistency across projects. These conventions are outlined in PEP 8, the official Python style guide. Following these guidelines makes your code more professional and easier for other developers to understand.
<a id="variable-naming"></a>
When naming variables in Python, follow the PEP 8 style guide. Use lowercase letters with underscores for variable names (snake_case). Variable names should be descriptive and meaningful. Avoid using single letters except for loop counters. Good examples include `user_name`, `total_count`, and `is_valid`. Bad examples include `x`, `data`, and `temp`.

<br>

Quiz with Explanation


=== "HTML Syntax"

    ```
    ‎@START
    @title: Python Naming Conventions

    Which variable name follows Python naming conventions?
    [ ] UserName
    [x] user_name
    [ ] userName
    [ ] user-name
    @explanation: Learn more about <a href="#variable-naming">variable naming conventions</a>  in the lecture notes.
    @END
    ```

=== "Markdown Syntax"

    ```
    ‎@START
    @title: Python Naming Conventions

    Which variable name follows Python naming conventions?
    [ ] UserName
    [x] user_name
    [ ] userName
    [ ] user-name
    @explanation: Learn more about [variable naming conventions](#variable-naming) in the lecture notes.
    @END
    ```

=== "Rendered Quiz"

    @START
    @title: Python Naming Conventions

    Which variable name follows Python naming conventions?
    [ ] UserName
    [x] user_name
    [ ] userName
    [ ] user-name
    @explanation: Learn more about <a href="#variable-naming">variable naming conventions</a>in the lecture notes.
    @END

---

**Linking to other files**

When linking from a quiz `@explanation`, you must link to the **built site URL**, not the raw `*.md` source file name. (The quiz explanation content is rendered client-side, so MkDocs doesn’t get a chance to rewrite `index.md#...` into the correct page URL.)

In most MkDocs sites (default “directory URLs”), pages look like `/page-name/` in the browser:
- `index.md` becomes the site root: `../`
- `lecture_notes.md` becomes: `../lecture_notes/`

Then add the anchor: `#anchor-name` (lowercase, dash-separated).


In `additional_quizzes.md` we have the following heading:

```
## Short Description
The Markdown Quiz Plugin is a powerful, lightweight extension...
```

In our quiz we include:

=== "HTML Syntax"
    ```
    @explanation: See a demo <a href="../#short-description">here</a>
    ```

=== "Markdown Syntax"
    ```
    @explanation: See a demo [here](../#short-description)
    ```
<br>

Complete Quiz Example

=== "HTML Syntax"
    ```
    ‎@START
    @title: Introductory Quiz

    What is my favourite color?
    [ ] Blue
    [x] Green
    [ ] Purple
    [ ] Burgundy
    @explanation: See a demo [here](../additional_quizzes/#short-description)
    @END
    ```

=== "Markdown Syntax"
    ```
    ‎@START
    @title: Introductory Quiz

    What is my favourite color?
    [ ] Blue
    [x] Green
    [ ] Purple
    [ ] Burgundy
    @explanation: See a demo [here](../additional_quizzes/#short-description)
    @END
    ```

=== "Rendered Quiz"
    @START
    @title: Introductory Quiz

    What is my favourite color?
    [ ] Blue
    [x] Green
    [ ] Purple
    [ ] Burgundy
    @explanation: See a demo [here](../additional_quizzes/#short-description)
    @END


!!! Note "Recommendation"
    We suggest using the HTML format for better behaviour.

<br>


### Multiple Quizzes in Mkdown Files

It is possible to have multiple quizzes in a markdown file. Additionally, you can include quizzes from other markdown files using the `@include` directive. This allows you to organize quizzes in separate files and reuse them across your documentation.


There is a single line of code:

```
‎@include: file=filename.md, id=quiz-id1, quiz-id2, ...
```

**Including one Quiz**

To include one quiz from `additional_quizzes.md` use:

=== "Code"
    ```
    ‎@include: file=additional_quizzes.md, id=markdown-basics
    ```

=== "Rendered Quiz"
    @include: file=additional_quizzes.md, id=markdown-basics

---

**Including Multiple Quizzes**

To include multiple quizzes from the same file, list their IDs separated by commas:

=== "Code"
    ```
    ‎@include: file=additional_quizzes.md, id=markdown-basics, markdown-lists, markdown-links
    ```

=== "Rendered Quizzes"
    @include: file=additional_quizzes.md, id=markdown-basics, markdown-lists

!!! Note
    Make sure each quiz in the source file has a unique `@id:` identifier. The file path is relative to the current markdown file.


## Contributions

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
