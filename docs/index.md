@START
@title: Markdown Syntax Project
@description: A journey through the creation of our extended syntax plugin.
@time_limit: 5400
@layout: book
@allow_back: true
@feedback_mode: immediate
@shuffle_questions: false
@shuffle_answers: true
@author: The Epic Leader

---

Are you looking forward to hear more about the markdown syntax team and our work?
[x] YES
[ ] NO

@explanation: 
Great! Observation: Even if you selected "No", you will have to listen to the rest of the presentation:))

---

Who has worked on this epic?
[x] Péter
[x] Olaya
[x] Raul
[x] Mădă

---

Match the team members to their contributions during this project:

{Péter (Epic Leader) | Syntax Creation & Implementation}
{Olaya, Raul, Mădă | Initial Brainstorming & Ideation}

@explanation: 
While the whole team (Olaya, Raul, Mădă) was crucial for the initial brainstorming and idea generation, the actual implementation and syntax design was handled solo by the "Epic Leader" to ensure consistency.

---

Put the project workflow phases in the correct chronological order:

(1.) Definition of Requirements
(2.) Team Brainstorming Session
(3.) Solo Development of Syntax Logic
(4.) Documentation Updates

@explanation: 
The workflow evolved quickly. We started with a group effort to generate ideas. However, after the first couple of weeks, the project shifted to a solo effort to streamline the complex syntax logic.

---

Are you looking forward to the technical details?
[x] YES
[ ] NO

@explanation:
Sorry, NO is not an option:))

---

If you write the following in our markdown file:
`[x] Left midfielder`

How will this specific line be rendered to the user?

[x] As a checked checkbox
[ ] As an empty checkbox
[ ] As a clickable button
[ ] As a text input field

@explanation: 
This is the core of the Single Choice syntax. We designed it to mimic standard checkbox behavior but parsed into an interactive quiz element.

---

We wanted a compact way to offer choices inline.
If you type: `The sky is { {blue|red|green} }.`

Which of the following statements is TRUE about the rendering?

[x] It creates a dropdown menu, and "blue" is automatically set as the correct answer.
[ ] It creates three radio buttons side-by-side.
[ ] It creates a dropdown, but you must specify the correct answer with an asterisk.

@explanation: 
We implemented the syntax `{{correct|option|option}}`. The parser automatically identifies the first item in the list as the correct answer, simplifying the quiz creation process for teachers.

---

How do we define the "Matching" pairs (like the team roles slide you saw earlier)?

[x] { Option A | Match A }
[ ] [ Option A -> Match A ]
[ ] < Option A, Match A >

@explanation: 
We chose curly braces `{}` with a pipe `|` separator. This keeps the syntax clean and distinct from standard Markdown links or images.

---

Can we include images in our quizzes to make them visual?

[x] Yes, just use standard Markdown image syntax `‎!‎[Al‎t]‎(‎u‎rl‎)‎` before the options.
[ ] No, images are forbidden.
[ ] Only if you use complex HTML `<img>` tags.

@explanation: 
It's seamless! You simply place a standard image tag `![Alt Text](/image.png)` before the question options. The plugin automatically recognizes it as a "Picture Quiz."

---

To create an ordering question (like the Timeline slide earlier), which syntax did we settle on?

[x] (1.) First Item
[ ] 1. First Item
[ ] [1] First Item
[ ] > 1. First Item

@explanation: 
We chose `(1.)` with parentheses to distinguish it clearly from standard Markdown ordered lists. This ensures the parser knows exactly when a "Drag and Drop" ordering question begins.

---

How did we set the 5400-second timer for this presentation?

[x] @time_limit: 5400
[ ] @timer: 5400
[ ] @countdown: 5400

@explanation: 
Global configurations like `@time_limit`, `@title`, and `@layout` live at the very top of the file. They control the behavior of the entire quiz session.

---

Can we proceed to reflect on the epic?
[x] YES

@explanation: Now we've made your choice easy:))

---

What was the Hardest Part of this project?

[ ] Finding the keywords for certain functionalities
[x] Defining the basics of the extended syntax
[ ] Getting the team to agree on ideas

---

Conversely, which part of the project went surprisingly smoothly?

[x] The momentum once the basics were established
[ ] Keeping the documentation up to date
[ ] Communication regarding minor changes

@explanation: 
Once the foundational logic was set, the rest was "pretty easy." The difficult part was just getting that initial system perfect.

---

What was the most significant non-technical challenge faced during development?

[ ] Learning new programming languages
[x] Communication & Documentation maintenance
[ ] The time limit for the project
[ ] Using Git

@explanation: 
Keeping the documentation synchronized with every minor change in the syntax, and communicating those changes to the wider group, proved to be the main friction point.

---

Does this plugin allow for a fully interactive presentation entirely in Markdown (with some extensions)?

[x] Yes (You are looking at it!)
[ ] No

@explanation: 
Thank you for listening!
@END