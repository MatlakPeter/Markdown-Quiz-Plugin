/**
 * =============================================================================
 * SECTION 1: MAIN ENTRY POINT
 * =============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
    // Find all quiz containers on the page and initialize them individually
    document.querySelectorAll('.quiz-container').forEach(initializeQuiz);
});

/**
 * =============================================================================
 * SECTION 2: QUIZ INSTANCE LOGIC
 * Encapsulates the state and behavior for a single quiz on the page.
 * =============================================================================
 */
function initializeQuiz(container) {
    // 1. Select Elements
    const questions     = container.querySelectorAll(".quiz-question-block");
    const nextBtn       = container.querySelector(".quiz-nav-next");
    const prevBtn       = container.querySelector(".quiz-nav-previous");
    const submitBtn     = container.querySelector('.quiz-nav-submit');
    const statusText    = container.querySelector(".quiz-status-text");
    const progressBar   = container.querySelector(".quiz-progress-bar");
    const resultsDiv    = container.querySelector(".quiz-results");
    const navContainer  = container.querySelector(".quiz-navigation");

    // 2. Quiz State
    let currentIndex = 0;

    // 3. Setup Questions (Shuffle answers, init dropdowns)
    questions.forEach(setupQuestion);

    // 4. Initialize Display (Show first question, hide others)
    updateDisplay();

    // 5. Bind Navigation Events
    nextBtn.addEventListener("click", () => {
        if (currentIndex < questions.length - 1) {
            changeQuestion(1);
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            changeQuestion(-1);
        }
    });

    if (submitBtn) {
        submitBtn.addEventListener('click', handleQuizSubmit);
    }

    // --- Internal Helper Functions for this Instance ---

    function changeQuestion(delta) {
        questions[currentIndex].style.display = "none";
        currentIndex += delta;
        updateDisplay();
    }

    function updateDisplay() {
        const currentQuestion = questions[currentIndex];
        
        // Lazy init for ordering questions (SortableJS)
        if (currentQuestion.dataset.type === "ordering" && !currentQuestion.dataset.initialized) {
            initOrdering(currentQuestion);
            currentQuestion.dataset.initialized = "true";
        }

        // Show current question
        currentQuestion.style.display = "block";

        // Update UI Text & Progress
        statusText.textContent = `Question ${currentIndex + 1}/${questions.length}`;
        const progressPercent = (currentIndex / questions.length) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Update Buttons visibility
        prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
        
        const isLast = currentIndex === questions.length - 1;
        nextBtn.style.display = isLast ? "none" : "inline-block";
        submitBtn.style.display = isLast ? "inline-block" : "none";
    }

    function handleQuizSubmit() {
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitted";
        
        // Hide the active question and navigation
        questions[currentIndex].style.display = "none";
        navContainer.style.display = "none";
        progressBar.style.width = "100%";

        // Generate and show report
        const reportHTML = generateReport(container);
        if (resultsDiv) {
            resultsDiv.innerHTML = reportHTML;
            resultsDiv.style.display = 'block';
        }
    }
}

/**
 * =============================================================================
 * SECTION 3: QUESTION SETUP & INTERACTION
 * Functions responsible for preparing questions and handling user selection.
 * =============================================================================
 */
function setupQuestion(questionBlock) {
    const answerContainer = questionBlock.querySelector(".quiz-answer-container");
    const dropdown = questionBlock.querySelector(".quiz-dropdown");
    const answerButtons = questionBlock.querySelectorAll(".quiz-answer");

    // A. Handle standard buttons (Multiple/Single Choice)
    if (answerContainer && answerButtons.length > 0) {
        randomizeAnswers(answerContainer);
        
        const questionType = questionBlock.getAttribute("data-type") || "multiple";
        
        // Re-query buttons in case they were reordered by randomization
        const currentButtons = questionBlock.querySelectorAll(".quiz-answer");
        currentButtons.forEach(btn => {
            btn.addEventListener("click", function() {
                handleSelection(this, questionType, currentButtons);
            });
        });
    }

    // B. Handle Dropdowns
    if (dropdown) {
        setupDropdown(dropdown);
    }
}

function handleSelection(clickedButton, type, allButtons) {
    const isSelected = clickedButton.classList.contains("selected");

    if (type === "single") {
        // Deselect all others
        allButtons.forEach(btn => toggleButtonState(btn, false));
        // Select clicked (if it wasn't already)
        if (!isSelected) {
            toggleButtonState(clickedButton, true);
        }
    } else {
        // Toggle current button
        toggleButtonState(clickedButton, !isSelected);
    }
}

function toggleButtonState(button, select) {
    if (select) {
        button.classList.add("selected");
        button.style.backgroundColor = 'blue';
        button.style.color = "white";
    } else {
        button.classList.remove("selected");
        button.style.backgroundColor = "";
        button.style.color = "";
    }
}

function randomizeAnswers(container) {
    const buttons = Array.from(container.querySelectorAll('.quiz-answer'));
    if (buttons.length <= 1) return;
    
    shuffleArray(buttons);
    buttons.forEach(btn => container.appendChild(btn));
}

function setupDropdown(dropdown) {
    const options = Array.from(dropdown.querySelectorAll('option:not([disabled])'));
    const placeholder = dropdown.querySelector('option[disabled]');
    
    shuffleArray(options);
    
    dropdown.innerHTML = '';
    if (placeholder) dropdown.appendChild(placeholder);
    options.forEach(opt => dropdown.appendChild(opt));
    
    dropdown.selectedIndex = 0;
}

function initOrdering(questionElement) {
    // Requires SortableJS library
    const list = questionElement.querySelector(".quiz-ordering-list");
    if (!list) return;

    const items = Array.from(list.children);
    shuffleArray(items);
    items.forEach(item => list.appendChild(item));

    if (typeof Sortable !== 'undefined') {
        new Sortable(list, {
            animation: 150,
            ghostClass: "ordering-ghost"
        });
    }
}

/**
 * =============================================================================
 * SECTION 4: REPORTING ENGINE
 * Functions responsible for grading and generating the final HTML report.
 * =============================================================================
 */
function generateReport(container) {
    const questions = container.querySelectorAll('.quiz-question-block');
    let totalScore = 0;
    let questionsHTML = "";

    questions.forEach((q, index) => {
        let result;
        const type = q.dataset.type;

        if (type === "ordering") {
            result = reportOrdering(q, index);
        } else if (type === "dropdown") {
            result = reportDropdown(q, index);
        } else {
            result = reportQuestion(q, index);
        }

        questionsHTML += result.html;
        if (result.isCorrect) totalScore++;
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

function reportQuestion(questionElement, index) {
    const questionText = questionElement.querySelector('.quiz-question').innerHTML;
    const allAnswers = Array.from(questionElement.querySelectorAll('.quiz-answer'));

    const userSelected = allAnswers.filter(btn => btn.classList.contains('selected'));
    const correctAnswers = allAnswers.filter(btn => btn.dataset.correct === 'true');

    // Logic: Correct if number of items match AND no incorrect items were selected
    let isCorrect = (userSelected.length === correctAnswers.length);
    userSelected.forEach(btn => {
        if (btn.dataset.correct === "false") isCorrect = false;
    });

    const formatList = (btns) => btns.map(b => b.innerText).join(', ') || '<em>None</em>';
    
    return createReportCard(index, questionText, isCorrect, formatList(userSelected), formatList(correctAnswers));
}

function reportDropdown(questionBlock, index) {
    const questionTextElement = questionBlock.querySelector('.quiz-question');
    const dropdown = questionBlock.querySelector('.quiz-dropdown');

    let isCorrect = false;
    let userAnswerDisplay = "None";
    let correctAnswerDisplay = "";
    
    if (dropdown) {
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        
        // Find correct text
        dropdown.querySelectorAll('option').forEach(option => {
            if (option.dataset.correct === "true") correctAnswerDisplay = option.textContent;
        });

        // Find user text
        if (selectedOption && !selectedOption.disabled) {
            userAnswerDisplay = selectedOption.textContent;
            isCorrect = (selectedOption.dataset.correct === "true");
        }
    }

    // Clone question to hide the dropdown UI in the report
    const questionClone = questionTextElement.cloneNode(true);
    const dropdownInClone = questionClone.querySelector('.quiz-dropdown');
    
    if (dropdownInClone) {
        const placeholder = document.createElement('span');
        placeholder.textContent = ' [...] '; 
        placeholder.style.fontWeight = "bold";
        dropdownInClone.parentNode.replaceChild(placeholder, dropdownInClone);
    }

    return createReportCard(index, questionClone.innerHTML, isCorrect, userAnswerDisplay, correctAnswerDisplay);
}

function reportOrdering(questionElement, index) {
    const questionText = questionElement.querySelector('.quiz-question').innerHTML;
    const items = Array.from(questionElement.querySelectorAll('.quiz-order-item'));

    const isCorrect = items.every((item, pos) => Number(item.dataset.correctOrder) === pos + 1);

    const userOrder = items.map(i => i.innerText).join(", ");
    
    const correctOrder = items.slice()
        .sort((a, b) => Number(a.dataset.correctOrder) - Number(b.dataset.correctOrder))
        .map(i => i.innerText)
        .join(", ");

    return createReportCard(index, questionText, isCorrect, userOrder, correctOrder);
}

// Reusable HTML generator for reports
function createReportCard(index, questionText, isCorrect, userAns, correctAns) {
    const statusIcon = isCorrect ? '✅' : '❌';
    const borderColor = isCorrect ? 'green' : 'red';
    const userColor = isCorrect ? 'green' : 'red';

    const html = `
        <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #ccc; border-left: 5px solid ${borderColor}; background: #fff; border-radius: 5px;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">
                ${index + 1}. ${questionText} ${statusIcon}
            </p>
            <div style="font-size: 0.95em; color: #555;">
                <div style="margin-bottom: 4px;">
                    <strong>Your Answer:</strong> 
                    <span style="color: ${userColor}">${userAns}</span>
                </div>
                <div>
                    <strong>Correct Answer:</strong> 
                    <span style="color: green">${correctAns}</span>
                </div>
            </div>
        </div>
    `;
    return { html, isCorrect };
}

/**
 * =============================================================================
 * SECTION 5: UTILITIES
 * =============================================================================
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}