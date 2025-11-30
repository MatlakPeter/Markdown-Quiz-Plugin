document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.quiz-container').forEach((container) => {
        const questions = container.querySelectorAll(".quiz-question-block");
        const nextBtn = container.querySelector(".quiz-nav-next");
        const prevBtn = container.querySelector(".quiz-nav-previous");
        const statusText = container.querySelector(".quiz-status-text");
        const buttons = container.querySelectorAll(".quiz-answer");
        const resultsDiv = container.querySelector(".quiz-results");
        const submitBtn = container.querySelector('.quiz-nav-submit');
        const progessBar = container.querySelector(".quiz-progress-bar");
        
        let currentIndex = 0;
        let previousIndex = 0;
        for (let i = 1; i < questions.length; i++) {
            questions[i].style.display = "none";
        }
        updateQuizDisplay();

        buttons.forEach(button => {
            button.addEventListener("click", function () {
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    this.style.backgroundColor = "";
                    this.style.color = "";
                    return;
                }
                
                this.classList.add("selected");
                const isCorrect = this.dataset.correct === "true";
                this.style.backgroundColor = 'blue'
                this.style.color = "white";
            });
        });

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                submitBtn.disabled = true;
                submitBtn.innerText = "Submitted";
                questions[questions.length - 1].style.display = "none";
                progessBar.style = "width: 100%";
                container.querySelector(".quiz-navigation").style.display = "none";
                const reportHTML = generateReport(container);
                if (resultsDiv) {
                    resultsDiv.innerHTML = reportHTML;
                    resultsDiv.style.display = 'block';
                }
            });
        }

        nextBtn.addEventListener("click", () => {
            if (currentIndex < questions.length - 1) {
                currentIndex++;
                updateQuizDisplay();
             }
        });
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateQuizDisplay();
            }
        });

        function updateQuizDisplay() {
            questions[previousIndex].style.display = "none";
            questions[currentIndex].style.display = "block";
            previousIndex = currentIndex;

            statusText.textContent = "Question " + (currentIndex + 1) + "/" + questions.length;
            progressWidth = (currentIndex / questions.length) * 100;
            progessBar.style = "width: " + progressWidth + "%";
            prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
            nextBtn.style.display = currentIndex === questions.length - 1 ? "none" : "inline-block";
            submitBtn.style.display = currentIndex === questions.length - 1 ? "inline-block" : "none";
        }
    });
});

function generateReport(container){
    const questions = container.querySelectorAll('.quiz-question-block');
    let totalScore = 0;
    let questionsHTML = "";

    questions.forEach((q, index) => {
        const questionText = q.querySelector('.quiz-question').innerHTML;
        const allAnswers = Array.from(q.querySelectorAll('.quiz-answer'));

        const userSelected = allAnswers.filter(btn => btn.classList.contains('selected'));
        const correctAnswers = allAnswers.filter(btn => btn.dataset.correct === 'true');
        let isCorrect = true;

        if(userSelected.length !== correctAnswers.length) {
            isCorrect = false;
        }

        userSelected.forEach(btn => {
            if(btn.dataset.correct === "false") {
                isCorrect = false;
            }
        });

        if(isCorrect) {
            totalScore++;
        }

        const formatList = (btns) => btns.map(b => b.innerText).join(', ') || '<em>None</em>';
        const statusIcon = isCorrect ? '✅' : '❌';

        questionsHTML += `
            <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #ccc; border-left: 5px solid ${isCorrect ? 'green' : 'red'}; background: #fff; border-radius: 5px;">
                <p style="margin: 0 0 10px 0; font-weight: bold;">
                    ${index + 1}. ${questionText} ${statusIcon}
                </p>
                
                <div style="font-size: 0.95em; color: #555;">
                    <div style="margin-bottom: 4px;">
                        <strong>Your Answer:</strong> 
                        <span style="${isCorrect ? 'color: green' : 'color: red'}">${formatList(userSelected)}</span>
                    </div>
                    <div>
                        <strong>Correct Answer:</strong> 
                        <span style="color: green">${formatList(correctAnswers)}</span>
                    </div>
                </div>
            </div>
        `;
    });

    return `
        <div style="padding: 20px; background-color: #f8f9fa; border-top: 2px solid #333; margin-top: 20px;">
            <h3 style="margin-top: 0;">Quiz Results</h3>
            <p style="font-size: 1.2em; margin-bottom: 20px;">
                You scored <strong>${totalScore}</strong> out of <strong>${questions.length}</strong>
            </p>
            <div class="quiz-review-list">
                ${questionsHTML}
            </div>
        </div>
    `;
}

