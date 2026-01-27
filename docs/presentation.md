#Presentation
@START
@title:Designing a Quiz Plugin people actually want
@author: Us
@time_limit: 5400
@feedback_mode: immediate
---
What do we bring to the table?
[x] Easy integration into an existing Markdown workflow
[x] Interactive learning and better engagement
[x] Instant feedback for learners
[x] Customizable design
[ ] Requires a separate backend service to run quizzes
[ ] Only works outside of MkDocs
---
Who is the plugin addressed to?
[x] Educators & trainers
[x] Anyone writing in Markdown
[ ] Only professional designers
[ ] Only database administrators
---
The journey begins
---
What were our expectations?
[x] It won't actually be 10 hours per week
[x] I expect to make something that I'm really proud of
---
What new terms did we learn on the first day?
[x] Work package
[] Leader
[x] User Story
[] Task
[x] Jour fixe
[x] Agile manifesto
[x] Definition of Done
[] Milestone
[] Requirement
---
At the start of the project, we believed meetings were mainly {{helpful but optional|essential for alignment|slowing us down|the core of teamwork}}
@explanation: Meetings turned out to be critical for coordination, decisions, and avoiding rework.
---
The project was structured in the following epics:
(1.) Research
(2.) UI/UX
(3.) Markdown syntax
(4.) MVP
(5.) Extension
(6.) Documentation
---
How did we use Taiga's features?
{Epics|Organise the overall structure of the project}
{Issues|Highlight problems and areas for improvement}
{Wiki|Document meetings and decisions}
---
We had a total of {{119|90|131|103}} artifacts on Taiga created
---
The project timeline
![Picture1](../pictures/timeline.png)
---
Our epics
---
1. User research
---
User Research Matters To {{Avoid building wrong features | Understand workflow | Validate ideas}}
---
Our approach, in order
(1.)Survey
(2.)Semi-Structured Interview
(3.)Competitor analysis
(4.)Requirements synthesis
---
Target Users
{Students | Self-study & revision}
{Educators | Course authoring & assessment}
---
What students told us
[x]Focus on revision and self-assessment
[x]Most wanted features
[x]Frustration with paywalls
[x]Most used quiz platforms
---
Most wanted features{{Explanations | Question randomization | Question overview | Timer | Feedback}}
![Features](/pictures/features.png)
---
Educator perspective: "It would be better to be able to work in my own environment"
---
Key Interview Insights
[x] Dislike of overly complex work environments like Moodle
[x] Wish for inline quizzes in course notes
[x] Need for simple and straightforward authoring in Markdown
---
Competitor Analysis
---
What existing tools do (and don't)
{Kahoot | Engagement through gamified UI}
{Moodle | Powerful, but complex}
{Quizlet | Simple, but limited}
---
Gap found: No tool fits Markdown \ static documentation workflows
---
From research to requirements: how insights became features
{Research insight | Requirements}
{"Students want explanations" | Per-question feedback}
{"Avoid platform segmentation" | Embedded quizzes}
---
Challenges faced
[x]Designing the questions
[x]Designing ALL the questions
[x]Balancing features with technical possibility
---
What went well 
[x]Clear user points
[x]Strong alignment
---
What we delivered
(1.) Research plan
(2.)Survey and Results
(3.)Interview transcript
(4.)Competitor analysis
(5.)Detailed requirements list
---
2. UI/UX
---
The UI/UX Epic was responsible with:
[x] Creation of low fidelity designs
[] Implementation of said designs
[x] User Testing - using Paper Prototypes
[x] Pilot and Usability Testing
[] Implementation of Question Types
---
In total we found {{5|6|7|4}} primary question types. It is going to be addresed in more detail in the next epic.
---
Phase 1 : Creation of the Designs
---
An intuitive design is essential for enabling users to quickly understand how a product works and interact with it effectively.
[x] True
[] False
---
Moodle-like design
![Design1](/pictures/Design1.png)
---
Kahoot-like design
![Design2](/pictures/Design2.png)
---
Phase 2 : Testing
---
Order the testing types:
(1.) User Testing
(2.) Pilot Testing
(3.) Usability Testing
---
What methods were used for the Testing Sessions?
[x] Think Aloud
[x] Guerilla 
[x] Task Based
[ ] Click Everywhere
@explanation: Guerilla Method is a fast, low-cost UX method for gathering immediate user insights by intercepting people in public spaces (e.g., coffee shops, cafes) for short 5–15 minute, informal interviews. --- The Think Aloud Method is a cognitive technique where individuals verbalize their thoughts, feelings, and processes while performing a task, offering insights into their thinking, problem-solving, or user experience. --- Task Based Testing is where users are asked to complete specific, realistic tasks within a product or prototype.
--- 
User Testing
---
![User Testing1](/pictures/User_Testing1.jpg)
---
![User Testing2](/pictures/User_Testing2.jpg)
---
![User Testing3](/pictures/User_Testing3.jpg)
---
Pilot Testing
---
Pilot Testing was conducted in order to make sure our product is up to standard and users can navigate and use a functional product, focusing on efficiency and user experience optimization.
---
![Pilot Testing](/pictures/Pilot_Testing.jpeg)
---
Usability Testing
---
Persons who took part in the Usability Testing :
{Diana | The Observer}
{Peter | The Moderator}
{Sorana | The Facilitator}
{Prof. Dr. Ute Trapp | The Tester}
---
3. Syntax definition
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
---
4. MVP
---
"MVP" stands for:
[] Most Valuable Player
[x] Minimum Viable Product
[] My Very (good) Presentation
[] Majestically Vibrant Parmesan 
---
Things I knew vs things I did not know:
{Good stories| User story}
{Good 'Epic moments' youtube videos | Epic from Taiga}
{How to talk | How to lead, organise and talk to a 5 person team}
{How to plug in my computer | What is a Mkdocs plugin}
---
Application workflow 
![Picture](/pictures/quiz.png)
---
The contract
![Picture](/pictures/contract.png)
---
5. Extension
---
On the extension epic, there was a total of {{10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 }} people working.
@explanation: It was the epic that involved the most contributors. While it was a help that we could work in parallel on multiple features, we also needed to make sure that these features overlap correctly.
---
A usual preparation for a meeting looked like this:
(1.) Requirements analysis
(2.) User Story definition
(3.) Implementation strategy
(4.) Definition of Done
---
Here we have the base product with an example question:
![one](/pictures/one.jpg)
Here you can see the rendered quiz after the first steps on the extension epic:
![two](/pictures/two.jpg)

Guess what have been added/improved!

[x] Timer
[x] Design
[ ] Explanations
[x] Button Layout
[ ] Immediate feedback

@explanation: Explanations and Immediate features were added in the next steps.
---
Here is the previously shown version of the quiz:
![two](/pictures/two.jpg)
Here you can see the rendered quiz after the next steps on the extension epic:
![three](/pictures/three.jpg)

2 new features just appeared, select them:

[] Timer
[] Design
[x] Explanations
[] Button Layout
[x] Immediate feedback
---
Here is the quiz  after the third set of features. Any improvements?
![four](/pictures/four.jpg)

[x] Adaptive design
[x] Latex math support
[] Button layout
---
Here it is how that example question looks like in the current version: 
Which of these facts about the "City of Science," Darmstadt, are correct?
[ ] Darmstadt is the capital of Germany.
[x] About $\frac{1}{2}$ of the city's total area is actually composed of forests and parks.
[ ] The population is exactly 500,000.
[x] Element 110, Darmstadtium ($Ds$), was discovered at the GSI Helmholtz Centre.
[x] The "Hochzeitsturm" (Wedding Tower) on Mathildenhöhe is a UNESCO World Heritage site.
@explanation: About Darmstadt's forests and parks you can read [here](https://www.darmstadt.de/leben/umwelt/im-gruenen/wald)
---
There is always room for improvement...
Based on our usability testing session, which "Extension" features were optimized to improve the learning flow?

[x] Timer alerts
[x] Partially correct answer coloring
[x] Targeted missed questions retake logic
[ ] Reference links
[ ] Matching question types

@explanation: Reference links and matching question types were the highlighted features. Usability testing was a helpful milestone for the Extension Epic. It pointed out features that would make the usability of the plugin more enjoyable.
---
6. Documentation
---
Are you ready to be bored by not-so-plain text?
[x] Yes
@explanation: You have no choice anyway! 😌
---
Some statistics
---
How many lines of code does the Documentation have?
[x] 847
[] 230
[] 655
[] 412
---
There are a total of 15 {{Rendered Quizzez|Blocks of code| Headers}} in the Documentation.
---
How many times did I change the style of the highlighted notes?

![Picture1](/pictures/NotesStyle.png)

[] 1
[] 2
[] 4
[x] 2^n

@explanation: And yet we chose the original colors as best fitting.
---
What was used?
---
What did we use to write our Documentation?
[] LateX
[x] Markdown
[] JavaScript & HTML
[x] Our plugin

@explanation: All sections of the documentation contain example quizzes related to their topic.
---
Who contributed?
---
Match the person with their work section:
{Mada | FAQ}
{Biborka | Introduction}
{Olaya | Toggle Cards}
{Diana | Epic Responsible}
---
The document is structured:

[x] like an onion
[] in top-down hierarchy
[x] in layers
[] like a cabbage
@explanation: The structure is based on the feedback received at the Usability testing. It is conceived to assist the user starting from the installation steps and reaching advanced customization gradually.
---
If it is so intuitive to use, let's test it.
---
Try to order the installation commands:

(1.) pip install mkdocs
(2.) pip install -i https://test.pypi.org/simple/ mkdocs-quiz-plugin
(3.) mkdocs new ProjectName
(4.) plugins: - quiz
(5.) mkdocs serve --livereload

@explanation: The steps are found in the Installation & Setup guide.
---
Now let's take a closer look 🔍
---
What we learned along the way
---
Who are these guys?
![PictureSimpsons](/pictures/simpsons.jpeg)
![PictureDark](/pictures/dark.jpg)
[] epics
[x] the team members
[x] computer scientists

---

What languages have we learned or become more skilled at during our project?

[x] java
[x] python
[] ryanair
[x] css
[x] markdown

---
What is the key task approaching the project?
[] Collecting and classifying everyone's ideas
[x] Matching perfectly person and task
[] Getting along with everyone
[] Setting meetings

---
What is one of the most important things we have learned about markdown?
[] That is the best language
[] How to use it
[x] How much in can be done with it

---
How have we increased our creativity?
[x] Thinking of new approaches to the different problems that arised
[] Painting during our meetings
[x] Asking ourselves questions about our own project's potential for improvement

---

What have we learned about project development?

[x] Initiative and self-sufficiency: no one is going to force to participate, you have to do so on your own
[x] Different cultures do not mean incompatibility: we have understood each other enough to build something together
[x] Mistakes and setbacks are going to happen: is part of the process


---


Then...what knowledge have we gathered and why?:

{Communication skills | Coordinating people from different cultures in a huge project }
{Creativity | Having freedom and a customizable project}
{Time management | Setting our own deadlines }
{Improvising | Changing aspects and timelines from the project }
{Minigolf | Team building }

---

So, as a conclusion of the project's final result: Team building...
[] has not influenced the project at all
[x] is key to getting to know your co-workers in order to develop a great project
[x] is as important as communication skills
sim
---
Demo
---
Future Implementations
---
Which of the following are the 5 key roadmap areas?

[x] Text-to-Speech Accessibility
[x] Multilingual Support  
[x] Gamification Engine
[x] Collaborative Mode
[x] Statistics & Feedback Tools

@explanation: These five areas focus on making the plugin more inclusive, global, and engaging for long-term study.
---

How will the "Statistics & Feedback" module improve the student experience?

[x] Identifying "Knowledge Gaps" through performance heatmaps
[x] Tracking time spent per question vs. accuracy
[x] Providing personalized study recommendations based on failed topics

@explanation: Data-driven feedback helps students work smarter, not harder, by highlighting exactly where they need to improve.
---

How is the plugin evolving to support a wider range of learning needs?

[x] 🔊 Text-to-Speech with multiple voice options
[x] ✍️ Right-to-left (RTL) script support for global languages
[x] 💡 Real-time text highlighting during audio playback

@explanation: Accessibility ensures that all students, regardless of ability or language, have equal access to learning materials.
---

Which features are part of the Gamification Engine?

[x] ⚡ Daily streak tracking
[x] ⭐ XP & level progression
[x] 🏆 Achievement badges

@explanation: Gamification focuses on engagement mechanics like streaks, XP, and badges to motivate consistent, long-term learning habits.

---

Match the "Future Vision" with the proposed technical implementation:

{Accessibility | Web Speech API}
{Global Reach | i18n JSON Framework}
{Engagement | XP & Achievement System}
{Social Learning | WebSocket Architecture}

@explanation:We use the Web Speech API for native audio, i18n JSON for instant translations, XP systems for logic, and WebSockets for real-time social interaction.
---

What is the ultimate goal of these future implementations?

[] To add as many buttons as possible
[] To replace the teacher entirely
[x] To transition from a "Static Tool" to a "Dynamic Learning Ecosystem"
[] To make the CSS file as large as possible

@explanation: Our goal is to create a living ecosystem that adapts to the student's needs and fosters a global community of learners.
---
![Picture](/pictures/meme.jpg)
---
Questions
---
@END