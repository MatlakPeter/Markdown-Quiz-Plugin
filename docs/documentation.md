# Project Documentation

## Introduction

This project is a quiz plugin that allows users to create and take quizzes using a simple Markdown-like syntax.

The MkDocs Quiz Plugin transforms static documentation into engaging, interactive learning experiences. This toolkit provides multiple question formats, all achievable through simple Markdown syntax.

It addresses key challenges in modern documentation: it transforms passive reading into active learning to improve retention, provides immediate verification to identify comprehension gaps, and enables interactive content creation without technical expertise.

By integrating knowledge checkpoints directly into learning materials, it ensures readers actively engage with content, moving beyond passive consumption to confirmed understanding.

## Getting Started

To get started with using this quiz plugin, include the `quiz.css` and `script.js` files in your HTML file. Then, create your quiz using the specified markdown format within a container element.

## Syntax Specifications

The quiz is created using a specific Markdown syntax:

```
@start
@title: My Quiz
@description: This is a description parsed from the markdown.
@author: John Doe
@timer_limit: 600
@layout: book 
@feedback_mode: immediate
@id: easy //only for imported quizzes - optional

@include: additional_quizzes.md, id1, id2, …
---
What is 2 + 2?
[] 3
[x] 4
[] 5
---
Which of the following countries are officially located on the continent of South America?
[] Costa Rica
[x] Bolivia
[] Mexico
[x] Uruguay
[x] Suriname
---
The octopus has {{3|1|4|8}} hearts
---
Put the planets in order from the sun
(1) Mercury
(2) Venus
(3) Earth
(4) Mars
---
Identify the object shown below:
![Apple logo](/apple_logo.png)
- [ ] Microsoft
- [x] Apple
- [ ] Google
- [ ] Meta
---
Which is the apple logo?
- [ ] ![placeholder](/mircosoft_logo.png)
- [x] ![placeholder](/apple_logo.png)
- [ ] ![placeholder](/meta_logo.png)
- [ ] ![placeholder](/google_logo.png)
@end
```

### Key words defining Quiz Behaviour

`@START` / `@END`
:   Marks the beginning and end of the interactive quiz block.
:   Signals the parser to switch from standard Markdown to Quiz mode.

`@id: <unique_name>`
:   Assigns a unique identifier to a quiz instance.
:   Essential for referencing specific quizzes in complex files.

`@include: <file_path>, <quiz_id>`
:   Imports a specific quiz from an external file.
:   Allows for reusability and cleaner course pages.

`@title: <text>` & `@description: <text>`
:   Sets the main header and introductory instructions.

`@layout: <list|book>`
:   List: All questions visible vertically.
:   Book: One question per slide.

`@time_limit: <minutes>`
:   Sets the countdown timer in minutes.

`@time_limit_seconds: <seconds>`
:   Alternative for shorter quizzes (overrides minutes).

`@shuffle_questions: <true|false>`
:   Randomizes question order to prevent memorization.

`@shuffle_answers: <true|false>`
:   Randomizes answer options (A, B, C, D).

`@feedback_mode: <immediate|end>`
:   Immediate: Shows results after every question.
:   End: Results revealed only upon final submission.

`@allow_skip: <true|false>`
:   Determines if questions can be left unanswered.

`@enable_survey: <true|false>`
:   Toggles a mini-feedback form for students after the quiz.

`@explanation: <text>`
:   Provides context for the correct answer during feedback.
:   Explains why an answer is right or wrong.

`@reference: <anchor_id>`
:   Creates a 'Go to definition' link.
:   Jumps student directly to the relevant explanation in lecture notes.

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

The quiz supports several types of questions:

*   **Single Choice:** The user can select only one correct answer.
*   **Multiple Choice:** The user can select multiple correct answers.
*   **Dropdown:** The user selects the correct answer from a dropdown menu.
*   **Ordering:** The user must arrange items in the correct order.
*   **Matching:** The user must match items from two lists.
*   **Picture Questions:** Questions that include images.

## Customization

The quiz plugin can be customized through various data attributes on the main quiz container. For example, you can set a timer, change the layout, and define the feedback mode.

## FAQ

**Q: How do I add a new question?**

A: You can add a new question by separating it with `---` in the markdown file.

**Q: Can I use this for commercial purposes?**

A: Please refer to the license agreement for usage rights.
