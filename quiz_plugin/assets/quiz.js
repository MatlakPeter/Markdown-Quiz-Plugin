document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.quiz-container').forEach((container) => {
        const questions = container.querySelectorAll(".quiz-question-block");
        const answerBlock = container.querySelectorAll(".quiz-answer-container");
        const nextBtn = container.querySelector(".quiz-nav-next");
        const prevBtn = container.querySelector(".quiz-nav-previous");
        const statusText = container.querySelector(".quiz-status-text");
        const buttons = container.querySelectorAll(".quiz-answer");
        const resultsDiv = container.querySelector(".quiz-results");
        const submitBtn = container.querySelector('.quiz-nav-submit');
        const progessBar = container.querySelector(".quiz-progress-bar");

        let currentIndex = 0;
        let previousIndex = 0;

        answerBlock.forEach(block => randomizeAnswers(block));

        for (let i = 1; i < questions.length; i++) {
            questions[i].style.display = "none";
        }
        updateQuizDisplay();

        //add eventlistener to every button
        // Initialize all questions (buttons AND dropdowns)
        questions.forEach(questionBlock => {
            const answerButtons = questionBlock.querySelectorAll(".quiz-answer");
            const dropdown = questionBlock.querySelector(".quiz-dropdown");
            
            // Check if this is a dropdown question
            if (dropdown) {
                setupDropdownQuestion(questionBlock, dropdown);
            } else if (answerButtons.length > 0) {
                const questionType = questionBlock.getAttribute("data-type") || "multiple";
                
                answerButtons.forEach(button => {
                    button.addEventListener("click", function () {
                        handleAnswerClick(this, questionType, answerButtons);
                    });
                });
            }
        });

        function handleAnswerClick(clickedButton, questionType, allButtons) {
            if (questionType === "single") {
               //for deselection: store if the button was already clicked
                const wasSelected = clickedButton.classList.contains("selected");

                //deselect all buttons
                allButtons.forEach(btn => {
                    btn.classList.remove("selected");
                    btn.style.backgroundColor = "";
                    btn.style.color = "";
                });

                //if the button wasn't selected before -> select it
                if (!wasSelected) {
                    clickedButton.classList.add("selected");
                    clickedButton.style.backgroundColor = 'blue';
                    clickedButton.style.color = "white";
                }
                //if it was selected before, it already got cleared at deselection
            } else {
                //for multiple choice
                if (clickedButton.classList.contains("selected")) {
                    //if already selected -> deselect it
                    clickedButton.classList.remove("selected");
                    clickedButton.style.backgroundColor = "";
                    clickedButton.style.color = "";
                } else {
                    //if not selected -> select it
                    clickedButton.classList.add("selected");
                    clickedButton.style.backgroundColor = 'blue';
                    clickedButton.style.color = "white";
                }
            }
        }

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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a remaining element
        const j = Math.floor(Math.random() * (i + 1));
        // Swap it with the current element
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function randomizeAnswers(block) {
    // Find all answer buttons within the current question block
    const answerButtons = Array.from(block.querySelectorAll('.quiz-answer'));

    // Only shuffle if there's more than one answer
    if (answerButtons.length <= 1) return;

    // Shuffle the array of button elements
    shuffleArray(answerButtons);

    // Re-append the shuffled buttons to the parent container (the block itself).
    // Appending an existing element moves it, achieving the reordering.
    answerButtons.forEach(button => {
        block.appendChild(button);
    });
}

function setupDropdownQuestion(questionBlock, dropdown) {
    //shuffle options
    const options = Array.from(dropdown.querySelectorAll('option:not([disabled])'));
    shuffleArray(options);
    
    const placeholder = dropdown.querySelector('option[disabled]');
    
    dropdown.innerHTML = '';
    if (placeholder) {
        dropdown.appendChild(placeholder);
    }
    options.forEach(option => {
        dropdown.appendChild(option);
    });
    
    dropdown.selectedIndex = 0;
}


function generateReport(container) {
    const questions = container.querySelectorAll('.quiz-question-block');
    let totalScore = 0;
    let questionsHTML = "";

    questions.forEach((q, index) => {
        const questionElement = q.querySelector('.quiz-question');
        const dropdown = q.querySelector('.quiz-dropdown');
        
        let isCorrect = false;
        let userAnswerDisplay = "None";
        let correctAnswerDisplay = "";
        let displayQuestion = "";
        
        
        if (dropdown) {
            const selectedOption = dropdown.options[dropdown.selectedIndex];
            
            const options = dropdown.querySelectorAll('option');
            options.forEach(option => {
                if (option.dataset.correct === "true") {
                    correctAnswerDisplay = option.textContent;
                }
            });
            
            const questionClone = questionElement.cloneNode(true);
            const dropdownClone = questionClone.querySelector('.quiz-dropdown');
            
            if (selectedOption && !selectedOption.disabled) {
                userAnswerDisplay = selectedOption.textContent;
                isCorrect = selectedOption.dataset.correct === "true";
            }
            
           
            if (dropdownClone) {
                const placeholderSpan = document.createElement('span');
                placeholderSpan.textContent = '...';  
                placeholderSpan.style.margin = '0 3px';
                dropdownClone.parentNode.replaceChild(placeholderSpan, dropdownClone);
            }
            
            displayQuestion = questionClone.innerHTML;
            
        } else {
            const allAnswers = Array.from(q.querySelectorAll('.quiz-answer'));
            const userSelected = allAnswers.filter(btn => btn.classList.contains('selected'));
            const correctAnswers = allAnswers.filter(btn => btn.dataset.correct === 'true');

            const buttonQuestionType = q.getAttribute("data-type") || "multiple";

            const formatList = (btns) => btns.map(b => b.innerText).join(', ') || '<em>None</em>';
            userAnswerDisplay = formatList(userSelected);
            correctAnswerDisplay = formatList(correctAnswers);

            if (buttonQuestionType === "single") {
                if (userSelected.length === 1) {
                    isCorrect = userSelected[0].dataset.correct === "true";
                }
            } else {
                isCorrect = true;
                if (userSelected.length !== correctAnswers.length) isCorrect = false;
                userSelected.forEach(btn => {
                    if (btn.dataset.correct === "false") isCorrect = false;
                });
            }
            
          
            displayQuestion = questionElement.innerHTML;
        }

        // Score calculation
        if (isCorrect) {
            totalScore++;
        }

        const statusIcon = isCorrect ? '✅' : '❌';
        const questionTypeLabel = dropdown ? "dropdown" : (q.getAttribute("data-type") || "multiple");
       

        questionsHTML += `
            <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #ccc; border-left: 5px solid ${isCorrect ? 'green' : 'red'}; background: #fff; border-radius: 5px;">
                <p style="margin: 0 0 10px 0; font-weight: bold;">
                    ${index + 1}. ${displayQuestion} ${statusIcon}
                </p>
                
                <div style="font-size: 0.95em; color: #555;">
                    <div style="margin-bottom: 4px;">
                        <strong>Your Answer:</strong> 
                        <span style="${isCorrect ? 'color: green' : 'color: red'}">${userAnswerDisplay}</span>
                    </div>
                    <div>
                        <strong>Correct Answer:</strong> 
                        <span style="color: green">${correctAnswerDisplay}</span>
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