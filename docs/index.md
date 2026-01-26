@START
@id: comprehensive-math-science-quiz
@title: Advanced STEM Challenge
@time_limit: 300
@layout: book
@feedback_mode: end
@shuffle_questions: false
@required_score: 4

Identify the correct form of the Quadratic Formula used to solve $ax^2 + bx + c = 0$: 

[x] $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
[ ] $x = \frac{b \pm \sqrt{b^2 + 4ac}}{2a}$
[ ] $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{a}$
[ ] $x = \frac{-b + b^2 - 4ac}{2a}$

@explanation: The quadratic formula is derived by completing the square on the general quadratic equation $ax^2 + bx + c = 0$.
---
Which of the following are properties of the function $f(x) = \sin(x)$? (Select all that apply)

[x] The range is $[-1, 1]$.
[ ] The function is even ($f(x) = f(-x)$).
[x] The function is odd ($f(-x) = -f(x)$).
[x] The period of the function is $2\pi$.

@explanation: $\sin(x)$ is symmetric with respect to the origin, making it an odd function where $\sin(-x) = -\sin(x)$.
---
In calculus, the limit of the expression $\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n$ is a fundamental constant. 

This expression evaluates to {{ $e$ | $1$ | $\infty$ | $0$ }}.

@explanation: This is one of the standard definitions for the base of the natural logarithm, $e \approx 2.718$.
---
Match the following physical and mathematical laws to their standard formulas:

{Einstein's Energy | $E = mc^2$}
{Newton's Second Law | $F = ma$}
{Ideal Gas Law | $PV = nRT$}
{Pythagorean Theorem | $a^2 + b^2 = c^2$}

@explanation: These formulas represent the foundations of special relativity, classical mechanics, thermodynamics, and geometry.
---
Order the steps required to evaluate the definite integral $\int_{0}^{2} 3x^2 \, dx$:

(1.) Find the antiderivative: $F(x) = x^3$
(2.) Apply the Fundamental Theorem of Calculus: $[x^3]_{0}^{2}$
(3.) Substitute the upper limit: $2^3 = 8$
(4.) Subtract the lower limit: $8 - 0^3 = 8$

@explanation: We use the Power Rule for integration, $\int x^n dx = \frac{x^{n+1}}{n+1}$, then evaluate at the boundaries.
---
Look at the formula below:
![Quadratic Formula Part](https://upload.wikimedia.org/wikipedia/commons/c/c4/Quadratic_formula.svg)

What is the specific term $b^2 - 4ac$ inside the square root called?

[ ] The Numerator
[x] The Discriminant
[ ] The Radicand
[ ] The Quotient

@explanation: The Discriminant ($D$) determines if the equation has two real roots ($D > 0$), one real root ($D = 0$), or two complex roots ($D < 0$).
@END

The Foundations of Applied Mathematics

Having reviewed the quadratic formula and the laws of motion in the quiz above, it is crucial to understand how these abstract concepts apply to reality. Whether calculating the trajectory of a particle using Newton's Second Law or determining the rate of reaction in chemistry using natural logarithms (e), mathematics serves as the language of the sciences.

The concept of the Discriminant (b2−4ac), which you identified in the final question, is particularly useful in engineering. It allows us to quickly determine the nature of a system's stability without solving the entire equation. If the discriminant is negative, we know the system involves complex numbers, often indicating oscillation or rotation rather than a straightforward linear solution.

## Test for reference

While mathematics defines the laws of the universe, geography defines our place within it. France, a country in Western Europe, encompasses medieval cities, alpine villages, and Mediterranean beaches.

The capital of France is Paris, a major European city and a global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond such landmarks as the Eiffel Tower and the 12th-century, Gothic Notre-Dame cathedral, the city is known for its cafe culture and designer boutiques along the Rue du Faubourg Saint-Honoré.

Understanding these basic facts is essential for general knowledge, much like arithmetic is for mathematics. Speaking of arithmetic, the fundamental operations (addition, subtraction, multiplication, and division) remain the building blocks for even the most complex calculus problems we discussed earlier.

@START
@time_limit: 100
@title: my quiz
@shuffle_questions: true
@feedback_mode: immediate
---
What is 2 + 2?
[] 3
[x] 4
[] 5
---
What is the capital of France?
[x] Paris
[] London
[] Berlin
@explanation: You can find the answer in [this chapter](#test-for-reference).
---
@END

Continued Learning: External Modules

We have now covered both complex STEM topics and general geography. The plugin also supports modular learning, allowing instructors to pull content from separate files. This is useful for "Review Sections" where questions from previous chapters are aggregated.

The section below demonstrates the @include feature, which dynamically loads a quiz stored in an external Markdown file (quiz.md). This keeps your main documentation clean and allows you to reuse questions across different pages of your course.
@include: file=quiz.md, id=easy
