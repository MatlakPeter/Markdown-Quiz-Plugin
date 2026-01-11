@START
@id: comprehensive-math-science-quiz
@title: Advanced STEM Challenge
@time_limit: 300
@layout: book
@feedback_mode: end
@shuffle_questions: false

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

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu lobortis justo, at bibendum odio. In tincidunt purus at massa porttitor pellentesque. Nullam ac nulla justo. Sed at felis vitae nunc pellentesque accumsan ut non ligula. Nulla facilisi. Vivamus efficitur tortor ac felis placerat blandit. Etiam feugiat nisi sit amet metus fermentum ultrices. In elit turpis, rutrum a gravida at, suscipit eget metus.

Cras fringilla ac augue at porta. Donec imperdiet arcu erat, maximus auctor sem aliquam at. Duis viverra porta bibendum. In gravida neque nec odio malesuada, a gravida libero luctus. Proin quis laoreet lectus. Aenean congue gravida metus, nec consectetur orci elementum non. Sed non sollicitudin erat, ac molestie sapien. Vestibulum pellentesque felis quis velit dictum dignissim. Nullam volutpat dapibus ex, eget convallis dolor. Curabitur iaculis sagittis varius.

Pellentesque tempor rutrum ligula, aliquam condimentum purus. Cras luctus tempus ipsum eu convallis. Nullam at nunc aliquet nisi lobortis luctus eu vel lorem. Nulla semper fringilla lorem eu efficitur. Proin eget libero maximus, pharetra est quis, pellentesque elit. Fusce pulvinar diam nec tortor blandit, quis finibus diam hendrerit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In hac habitasse platea dictumst. Etiam sit amet nulla a nibh vehicula tristique. Cras interdum eleifend eros at lacinia. Nulla tempus sapien purus, vitae imperdiet turpis porta eget. Sed mattis et ipsum non interdum. Nullam in nisl a lectus maximus congue. Donec mollis nunc et condimentum pulvinar.

## Test for reference

The capital of France is Paris.

Vestibulum et scelerisque metus, sit amet varius odio. Aenean molestie nibh ac mauris auctor convallis. Aliquam consectetur auctor scelerisque. Aenean rutrum dictum ante non auctor. Sed augue tellus, eleifend et tempor id, rhoncus eget leo. Proin consequat nisi laoreet nisl suscipit, id aliquam leo porttitor. Integer sollicitudin nulla nec est facilisis tristique. Vivamus quis quam faucibus, scelerisque metus sed, efficitur dui. Vivamus tristique dapibus sem, eget finibus arcu tincidunt commodo. Nam porttitor orci quis nulla venenatis, ac efficitur felis auctor. Aliquam id scelerisque augue, eget fringilla quam.

Quisque porttitor lorem id ultrices facilisis. Duis hendrerit mauris et mauris malesuada ornare. Praesent ac eros fringilla, placerat lorem ut, gravida velit. Aenean nec euismod ante. Nullam blandit neque at mauris faucibus sollicitudin. Fusce et massa in eros fermentum molestie. Donec tortor purus, porttitor ac neque vitae, tincidunt mattis mauris. Pellentesque elementum consectetur commodo. Etiam a vehicula diam, eu commodo nulla. Donec in ornare tortor, a dignissim libero. Sed eu convallis elit, nec consequat dolor. Cras sollicitudin scelerisque interdum. Nulla sit amet aliquam enim, ut tempus urna. Pellentesque volutpat, sem a aliquet viverra, sem dolor aliquet dolor, sit amet feugiat nibh neque fringilla sem. Pellentesque rhoncus a erat ultrices scelerisque. 

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


Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu lobortis justo, at bibendum odio. In tincidunt purus at massa porttitor pellentesque. Nullam ac nulla justo. Sed at felis vitae nunc pellentesque accumsan ut non ligula. Nulla facilisi. Vivamus efficitur tortor ac felis placerat blandit. Etiam feugiat nisi sit amet metus fermentum ultrices. In elit turpis, rutrum a gravida at, suscipit eget metus.

Cras fringilla ac augue at porta. Donec imperdiet arcu erat, maximus auctor sem aliquam at. Duis viverra porta bibendum. In gravida neque nec odio malesuada, a gravida libero luctus. Proin quis laoreet lectus. Aenean congue gravida metus, nec consectetur orci elementum non. Sed non sollicitudin erat, ac molestie sapien. Vestibulum pellentesque felis quis velit dictum dignissim. Nullam volutpat dapibus ex, eget convallis dolor. Curabitur iaculis sagittis varius.

Pellentesque tempor rutrum ligula, aliquam condimentum purus. Cras luctus tempus ipsum eu convallis. Nullam at nunc aliquet nisi lobortis luctus eu vel lorem. Nulla semper fringilla lorem eu efficitur. Proin eget libero maximus, pharetra est quis, pellentesque elit. Fusce pulvinar diam nec tortor blandit, quis finibus diam hendrerit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In hac habitasse platea dictumst. Etiam sit amet nulla a nibh vehicula tristique. Cras interdum eleifend eros at lacinia. Nulla tempus sapien purus, vitae imperdiet turpis porta eget. Sed mattis et ipsum non interdum. Nullam in nisl a lectus maximus congue. Donec mollis nunc et condimentum pulvinar.

Vestibulum et scelerisque metus, sit amet varius odio. Aenean molestie nibh ac mauris auctor convallis. Aliquam consectetur auctor scelerisque. Aenean rutrum dictum ante non auctor. Sed augue tellus, eleifend et tempor id, rhoncus eget leo. Proin consequat nisi laoreet nisl suscipit, id aliquam leo porttitor. Integer sollicitudin nulla nec est facilisis tristique. Vivamus quis quam faucibus, scelerisque metus sed, efficitur dui. Vivamus tristique dapibus sem, eget finibus arcu tincidunt commodo. Nam porttitor orci quis nulla venenatis, ac efficitur felis auctor. Aliquam id scelerisque augue, eget fringilla quam.

Quisque porttitor lorem id ultrices facilisis. Duis hendrerit mauris et mauris malesuada ornare. Praesent ac eros fringilla, placerat lorem ut, gravida velit. Aenean nec euismod ante. Nullam blandit neque at mauris faucibus sollicitudin. Fusce et massa in eros fermentum molestie. Donec tortor purus, porttitor ac neque vitae, tincidunt mattis mauris. Pellentesque elementum consectetur commodo. Etiam a vehicula diam, eu commodo nulla. Donec in ornare tortor, a dignissim libero. Sed eu convallis elit, nec consequat dolor. Cras sollicitudin scelerisque interdum. Nulla sit amet aliquam enim, ut tempus urna. Pellentesque volutpat, sem a aliquet viverra, sem dolor aliquet dolor, sit amet feugiat nibh neque fringilla sem. Pellentesque rhoncus a erat ultrices scelerisque. 
@dasjbdjas
@include: quiz.md, easy
