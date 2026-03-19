# 🧠 MkDocs Quiz Plugin

The **MkDocs Quiz Plugin** lets you embed rich, interactive quizzes directly in your MkDocs documentation using a simple Markdown-like syntax — no JavaScript knowledge required. Transform your static documentation into interactive learning experiences.

---

## ✨ Features

- **Multiple question types** — multiple choice, dropdown, ordering, matching, and picture questions
- **Flexible layouts** — paginated book mode or scrollable list mode
- **Instant or end-of-quiz feedback** with optional explanations and references
- **Timers, score thresholds, and shuffling** for a real assessment feel
- **Reusable quizzes** — define once, include anywhere via `@include`
- **MathJax support** for LaTeX math notation
- **Light & dark theme** compatible

---

## 📦 Installation

**Prerequisites:** Python 3.8+, MkDocs 1.0+

```bash
pip install -i https://test.pypi.org/simple/ mkdocs-quiz-plugin
```

Then enable it in your `mkdocs.yml`:

```yaml
plugins:
  - quiz
```

---

## 🚀 Quick Start

Every quiz lives between `@START` and `@END` tags:

```
@START
@title: My First Quiz

What is 2 + 2?
[ ] 3
[x] 4
[ ] 5

@END
```

Separate multiple questions with `---`:

```
@START
@title: Math Basics

What is 2 + 2?
[ ] 3
[x] 4
[ ] 5

---

What is 3 × 3?
[ ] 6
[x] 9
[ ] 12

@END
```

---

## 🎛️ Configuration Options

Customize any quiz with these optional keywords:

| Keyword | Description | Default |
|---|---|---|
| `@title: <text>` | Quiz header | Hidden |
| `@description: <text>` | Introductory instructions | Hidden |
| `@layout: list\|book` | Show all questions (`list`) or one at a time (`book`) | `book` |
| `@feedback_mode: end\|immediate` | When to reveal results | `end` |
| `@shuffle_questions: true\|false` | Randomize question order | `false` |
| `@time_limit: <seconds>` | Countdown timer | Hidden |
| `@required_score: <number>` | Minimum passing score | Hidden |
| `@allow_back: true\|false` | Allow returning to previous questions | `true` |
| `@id: <name>` | Unique identifier for referencing this quiz | — |
| `@author: <text>` | Quiz author | Hidden |

**Per-question only:**

| Keyword | Description |
|---|---|
| `@explanation: <text>` | Shown during feedback; supports Markdown and HTML links |

---

## 📝 Question Types

### Multiple Choice (single or multiple correct answers)

```
Which are programming languages? (Select all that apply)
[x] Python
[x] JavaScript
[ ] HTML
[x] Java
```

### Dropdown (first option = correct)

```
The octopus has {{3|1|4|8}} hearts.
```

### Ordering

```
(1.) Crack two eggs into a bowl.
(2.) Heat a skillet over medium-low heat.
(3.) Pour the eggs into the pan.
(4.) Stir gently until soft curds form.
(5.) Remove from heat while still moist.
```

### Matching

```
{Leonardo da Vinci | Mona Lisa}
{Vincent van Gogh | The Starry Night}
{Pablo Picasso | Guernica}
```

### Picture Questions

```
Identify the animal:
![Photo](https://example.com/rabbit.jpg)
[x] Rabbit
[ ] Cat
[ ] Horse
```

---

## 🔗 Explanations & References

Add an explanation to any question that links back to relevant content:

```
Which variable name follows Python conventions?
[ ] UserName
[x] user_name
[ ] userName
@explanation: See the [naming conventions](#variable-naming) section.
```

Supports both Markdown and HTML link syntax. When linking to other pages, use the built site URL (e.g., `../lecture_notes/#anchor`), not the raw `.md` file path.

---

## ♻️ Including Quizzes from Other Files

Define a quiz once in a separate file and include it anywhere:

```
@include: file=additional_quizzes.md, id=quiz-id
```

Include multiple quizzes at once:

```
@include: file=additional_quizzes.md, id=quiz-one, quiz-two, quiz-three
```

> Each quiz must have a unique `@id:` for this to work.

---

## 🤝 Contributing

Contributions are welcome! To get started:

```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/your-username/markdown-quizzes.git
cd markdown-quizzes

# 2. Set up a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install in editable mode
pip install -e .

# 4. Create a feature branch
git checkout -b your-feature-name

# 5. Make changes, test with mkdocs serve, then open a PR
```

---

## ❓ FAQ

<details>
<summary><strong>What happens if I don't specify a layout?</strong></summary>
The quiz defaults to <code>book</code> mode — one question at a time with navigation buttons.
</details>

<details>
<summary><strong>Can I use math equations?</strong></summary>
Yes! MathJax is supported. Use <code>$...$</code> for inline math and <code>$$...$$</code> for display math.
</details>

<details>
<summary><strong>What happens when the timer runs out?</strong></summary>
The quiz auto-submits with whatever answers have been given so far.
</details>

<details>
<summary><strong>Can students skip questions?</strong></summary>
Yes, by default.
</details>

<details>
<summary><strong>Is there score tracking?</strong></summary>
Scores are shown in-browser after submission. Backend tracking is not included — for analytics, you'd need custom JavaScript.
</details>

<details>
<summary><strong>What image formats are supported?</strong></summary>
All standard web formats: PNG, JPG, GIF, SVG, and base64 data URLs.
</details>

<details>
<summary><strong>Does it work with other MkDocs plugins?</strong></summary>
Yes — just add <code>- quiz</code> to your <code>plugins:</code> list in <code>mkdocs.yml</code>.
</details>
