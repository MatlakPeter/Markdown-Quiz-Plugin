window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
    },
    chtml: {
        scale: 1,
        minScale: 0.6,
        matchFontHeight: true
    },
    options: {
        ignoreHtmlClass: 'tex2jax_ignore',
        processHtmlClass: 'tex2jax_process'
    }
};
/**
 * =============================================================================
 * SECTION 1: MAIN ENTRY POINT
 * =============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.quiz-container').forEach(initializeQuiz);
});

/**
 * =============================================================================
 * SECTION 2: QUIZ INSTANCE LOGIC
 * =============================================================================
 */
function initializeQuiz(container) {
    // 1. Select Elements
    let questions = container.querySelectorAll(".quiz-question-block");
    const nextBtn = container.querySelector(".quiz-nav-next");
    const prevBtn = container.querySelector(".quiz-nav-previous");
    const submitBtn = container.querySelector('.quiz-nav-submit');
    const statusText = container.querySelector(".quiz-status-text");
    const progressBar = container.querySelector(".quiz-progress-bar");
    const progressBarContainer = container.querySelector(".quiz-progress-container"); // Needed for List Mode
    const resultsDiv = container.querySelector(".quiz-results");
    const navContainer = container.querySelector(".quiz-navigation");

    // Layout & Feedback Detection
    const layout = container.getAttribute("data-layout") || "book";
    const feedbackType = container.getAttribute("data-feedback-mode");
    const retakeBtn = container.querySelector(".quiz-btn-retake");

    // Timer specific elements
    const startScreen = container.querySelector(".quiz-start-screen");
    const startBtn = container.querySelector(".quiz-btn-start");
    const mainWrapper = container.querySelector(".quiz-main-wrapper");
    const timerDisplayContainer = container.querySelector(".quiz-timer-display");
    const timeDisplaySpan = container.querySelector("#time-display");

    // Timer State
    const timeLimitSeconds = parseInt(container.getAttribute('data-timer'), 10);
    let timeLeft = isNaN(timeLimitSeconds) ? null : timeLimitSeconds;
    let timerInterval = null;
    let startTime = null;

    // Quiz State
    let currentIndex = 0;

    let questionOrder = [];
    const shouldShuffle = container.getAttribute("data-shuffle-questions") === "true";
    const allow_back = container.getAttribute("data-allow-back") ? container.getAttribute("data-allow-back") === "true" : true;

    if (shouldShuffle) {
        questionOrder = shuffleQuestionOrder(container, questions);
        questions = container.querySelectorAll(".quiz-question-block");
    } else {
        questionOrder = Array.from({ length: questions.length }, (_, i) => i);
    }
    // =========================================================
    // INTERNAL HELPER FUNCTIONS
    // =========================================================

    if (resultsDiv && retakeBtn && resultsDiv.contains(retakeBtn)) {
        const buttonWrapper = document.createElement("div");
        buttonWrapper.className = "quiz-retake-wrapper";
        buttonWrapper.style.textAlign = "center";
        buttonWrapper.style.marginTop = "20px";

        // Insert the wrapper AFTER the results div
        resultsDiv.parentNode.insertBefore(buttonWrapper, resultsDiv.nextSibling);

        // Move the button into the wrapper
        buttonWrapper.appendChild(retakeBtn);
    }


    function setupTimerDisplay() {
        if (timeLeft === null || timeLeft <= 0) {
            if (timerDisplayContainer) timerDisplayContainer.style.display = 'none';
        } else {
            timeDisplaySpan.textContent = formatTime(timeLeft);
            if (timerDisplayContainer) timerDisplayContainer.style.display = 'block';
        }
    }

    function startTimer() {
        if (timeLeft === null || timeLeft <= 0) return;
        startTime = Date.now();
        timerInterval = setInterval(() => {
            timeLeft--;
            timeDisplaySpan.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleQuizSubmit(true);
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function handleQuizStart() {
        if (startScreen) startScreen.style.display = 'none';
        if (mainWrapper) mainWrapper.style.display = 'block';
        updateDisplay();
        startTimer();
    }

    function changeQuestion(delta) {
        if (layout === "list") return; // Disable paging in list mode
        const currentActualIndex = questionOrder[currentIndex];
        questions[currentActualIndex].style.display = "none";
        currentIndex += delta;
        updateDisplay();
    }

    function updateDisplay() {
        if (layout === "list") {
            // --- LIST MODE LOGIC ---
            questionOrder.forEach((actualIndex) => {
                const q = questions[actualIndex];
                q.style.display = "block"; // Show all

                // Visual separation for List Mode
                q.style.borderBottom = "1px solid #ddd";
                q.style.paddingBottom = "20px";
                q.style.marginBottom = "20px";

                if (q.dataset.type === "ordering" && !q.dataset.initialized) {
                    initOrdering(q);
                    q.dataset.initialized = "true";
                }

                // Show Check Answer buttons if immediate
                const checkBtn = q.querySelector(".quiz-btn-check-answer");
                if (checkBtn) {
                    checkBtn.style.display = (feedbackType === "immediate") ? "block" : "none";
                }
            });

            // Hide paging elements
            if (statusText) statusText.style.display = "none";
            if (progressBarContainer) progressBarContainer.style.display = "none";

            if (navContainer) {
                navContainer.style.display = "block";
                navContainer.style.textAlign = "center";
            }

            if (nextBtn) nextBtn.style.display = "none";
            if (prevBtn) prevBtn.style.display = "none";

            if (submitBtn) {
                submitBtn.style.display = "block";
                submitBtn.style.margin = "40px auto";
                submitBtn.textContent = "Finish and See Full Report";
            }
        }
        else {
            // --- BOOK MODE LOGIC ---
            const actualIndex = questionOrder[currentIndex];
            const currentQuestion = questions[actualIndex];

            if (currentQuestion.dataset.type === "ordering" && !currentQuestion.dataset.initialized) {
                initOrdering(currentQuestion);
                currentQuestion.dataset.initialized = "true";
            }

            questions.forEach((q, idx) => {
                q.style.display = (idx === actualIndex) ? "block" : "none";
            });

            // Check Answer button for current page
            const checkBtn = currentQuestion.querySelector(".quiz-btn-check-answer");
            if (checkBtn) {
                checkBtn.style.display = (feedbackType === "immediate") ? "block" : "none";
            }

            // Update Progress
            if (statusText) {
                statusText.style.display = "block";
                statusText.textContent = `Question ${currentIndex + 1}/${questions.length}`;
            }

            if (progressBar && questions.length > 0) {
                const progressPercent = (currentIndex / questions.length) * 100;
                progressBar.style.width = `${progressPercent}%`;
            }

            prevBtn.style.display = currentIndex === 0 || allow_back === false ? "none" : "inline-block";
            const isLast = currentIndex === questions.length - 1;
            nextBtn.style.display = isLast ? "none" : "inline-block";
            submitBtn.style.display = isLast ? "inline-block" : "none";
        }
        triggerMathJax();
    }

    function handleQuizSubmit(timeExpired = false) {
        stopTimer();

        if (progressBar) {
            progressBar.style.width = "100%";
        }

        if (mainWrapper) {
            const allQuestions = mainWrapper.querySelectorAll(".quiz-question-block");
            allQuestions.forEach(q => q.style.display = "none");

            if (navContainer) navContainer.style.display = "none";
            if (timerDisplayContainer) timerDisplayContainer.style.display = "none";
        }

        if (retakeBtn) retakeBtn.style.display = "inline-block";

        let timeTaken = null;
        if (startTime !== null) {
            const endTime = Date.now();
            timeTaken = Math.floor((endTime - startTime) / 1000);
        }

        const reportHTML = generateReport(container, timeTaken, questionOrder);

        if (resultsDiv) {
            resultsDiv.innerHTML = reportHTML;
            resultsDiv.style.display = 'block'; // Force visibility
            resultsDiv.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the score
            triggerMathJax();
            container.classList.add("quiz-results-shown");
        }
    }

    // --- EXECUTION ---

    // 1. Setup individual questions
    questions.forEach((q) => setupQuestion(q, feedbackType));

    function resetQuiz() {
        // 1. Reset State Variables
        currentIndex = 0;
        timeLeft = isNaN(timeLimitSeconds) ? null : timeLimitSeconds;

        // 2. DOM Cleanup: Questions and Answers
        questions.forEach(q => {
            // Remove feedback messages and explanations
            const feedback = q.querySelector('.quiz-feedback-msg');
            if (feedback) feedback.remove();

            const explanation = q.querySelector('.quiz-explanation');
            if (explanation) explanation.style.display = 'none';

            // Reset Standard Buttons
            q.querySelectorAll('.quiz-answer').forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('selected', 'correct', 'incorrect', 'shouldbecorrect');
            });

            // Reset Dropdowns
            const dropdown = q.querySelector('.quiz-dropdown');
            if (dropdown) {
                dropdown.disabled = false;
                dropdown.selectedIndex = 0;
                dropdown.style.border = "";
                dropdown.style.backgroundColor = "";
            }

            // 2. Handle Shuffle
            // Reset Matching
            if (q.dataset.type === 'matching') {
                const solvedArea = q.querySelector('.quiz-match-solved-area');
                if (solvedArea) solvedArea.innerHTML = '';
                q.querySelectorAll('.quiz-match-item').forEach(item => {
                    item.classList.remove('used', 'selected');
                    item.style.display = '';
                    item.style.pointerEvents = 'auto';
                });
            }

            // Reset Ordering
            if (q.dataset.type === 'ordering') {
                q.querySelectorAll('.quiz-order-item').forEach(item => {
                    item.style.border = "";
                    item.style.backgroundColor = "";
                    item.style.pointerEvents = 'auto';
                });
            }

            // Reset Check Answer Buttons
            const checkBtn = q.querySelector(".quiz-btn-check-answer");
            if (checkBtn) {
                checkBtn.disabled = false;
            }
        });

        // 3. UI Toggle
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
            resultsDiv.innerHTML = '';
        }
        if (retakeBtn) {
            retakeBtn.style.display = 'none';
        }

        // Restore Navigation & Submit Button ---
        if (navContainer) {
            navContainer.style.display = "flex"; // Restores the container hidden by handleQuizSubmit
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit"; // Reset text from "Submitted" or "Time Expired"
            submitBtn.style.display = "none"; // Hide initially (updateDisplay will show it if needed)
        }

        // 4. Return to Start or First Question
        if (startScreen) {
            startScreen.style.display = 'block';
            mainWrapper.style.display = 'none';
        } else {
            updateDisplay();
        }

        // 5. Reset Progress Bar
        if (progressBar) progressBar.style.width = "0%";

        // 6. Optional: Reshuffle if configured
        if (shouldShuffle) {
            questionOrder = shuffleQuestionOrder(container, questions);
            // If we reshuffle, we must call updateDisplay again to show the new Q1
            if (!startScreen) updateDisplay();
        }

    }

    // =========================================================
    // END OF INTERNAL HELPER FUNCTIONS
    // =========================================================


    // 3. Setup Questions (Shuffle answers, init dropdowns)
    questions.forEach(setupQuestion);

    // --- NEW RANDOMIZATION EXECUTION ---
    if (shouldShuffle) {
        // Calls the new global utility function
        questionOrder = shuffleQuestionOrder(container, questions);
    } else {
        // Keep original order: [0, 1, 2, 3, ...]
        questionOrder = Array.from({ length: questions.length }, (_, i) => i);
    }


    // 3. Init Display
    setupTimerDisplay();
    if (startScreen && startBtn) {
        startBtn.addEventListener("click", handleQuizStart);
    } else {
        updateDisplay();
    }

    // 4. Bind Nav
    if (nextBtn) nextBtn.addEventListener("click", () => changeQuestion(1));
    if (prevBtn) prevBtn.addEventListener("click", () => changeQuestion(-1));
    if (submitBtn) submitBtn.addEventListener('click', () => handleQuizSubmit(false));
    if (retakeBtn) {
        retakeBtn.addEventListener("click", () => resetQuiz());
    }
}

/**
 * =============================================================================
 * SECTION 3: QUESTION SETUP & INTERACTION (GLOBAL SCOPE)
 * Functions responsible for preparing questions and handling user selection.
 * =============================================================================
 */
function setupQuestion(questionBlock, feedbackType) {
    const questionTextElement = questionBlock.querySelector('.quiz-question');

    if (questionTextElement) {
        if (questionTextElement.innerHTML.includes('&amp;lt;') ||
            questionTextElement.innerHTML.includes('&amp;lsqb;')) {

            const decoder = document.createElement('textarea');
            decoder.innerHTML = questionTextElement.innerHTML;
            questionTextElement.innerHTML = decoder.value;
        }
    }
    const answerContainer = questionBlock.querySelector(".quiz-answer-container");
    const dropdown = questionBlock.querySelector(".quiz-dropdown");
    const answerButtons = questionBlock.querySelectorAll(".quiz-answer");
    const checkButton = questionBlock.querySelector(".quiz-btn-check-answer");


    // 1. Handle the Check Answer Button Listener
    if (checkButton) {
        checkButton.addEventListener('click', function () {
            handleCheckButton(this, questionBlock);
        });
    }

    // 2. Handle standard buttons (Multiple/Single Choice)
    if (answerContainer && answerButtons.length > 0) {
        randomizeAnswers(answerContainer);

        const questionType = questionBlock.getAttribute("data-type") || "multiple";

        // Re-query buttons in case they were reordered by randomization
        const currentButtons = questionBlock.querySelectorAll(".quiz-answer");
        currentButtons.forEach(btn => {
            btn.addEventListener("click", function () {
                handleSelection(this, questionType, currentButtons);
            });
        });
    }

    // 3. Handle Dropdowns
    if (dropdown) {
        setupDropdown(dropdown);
    }

    // 4. Handle Matching
    if (questionBlock.dataset.type === "matching") {
        setupMatching(questionBlock);
    }
}

function handleCheckButton(btn, questionBlock) {
    btn.disabled = true;
    const type = questionBlock.dataset.type;
    const quizFeedback = questionBlock.querySelector('.quiz-feedback-content')
    if (quizFeedback)
        quizFeedback.style.display = "block"
    let isCorrect = false;
    let feedbackText = "";

    // single , multiple
    if (type === "single" || type === "multiple") {
        const allAnswers = questionBlock.querySelectorAll(".quiz-answer")
        const userSelected = Array.from(allAnswers).filter(a => a.classList.contains("selected"));
        const correctAnswers = Array.from(allAnswers).filter(a => a.dataset.correct === 'true');

        isCorrect = (userSelected.length === correctAnswers.length) &&
            userSelected.every(a => a.dataset.correct === 'true')

        allAnswers.forEach(a => {
            a.disabled = true
            if (a.classList.contains('selected')) {
                a.classList.add(a.dataset.correct === 'true' ? 'correct' : 'incorrect')
            }
            else if (a.dataset.correct === 'true') {
                a.classList.add('shouldbecorrect');
            }
        })
    }

    // dropdown
    else if (type === 'dropdown') {
        const dropdown = questionBlock.querySelector('.quiz-dropdown')
        dropdown.disabled = true
        let selectedOption, correctAnswerDisplay;
        ({ isCorrect, selectedOption, correctAnswerDisplay } = reportDropdown(questionBlock, questionBlock.dataset.questionIndex, false))


        if (selectedOption.dataset.correct === 'true') {
            dropdown.style.border = "2px solid #1e7e34";
            dropdown.style.backgroundColor = "#28a745";
        }
        else {
            dropdown.style.border = "2px solid #b02a37";
            dropdown.style.backgroundColor = "#dc3545";
            feedbackText = `Correct Answer: <strong>${correctAnswerDisplay}</strong>`;
        }

    }
    // ordering
    else if (type === 'ordering') {
        const items = Array.from(questionBlock.querySelectorAll('.quiz-order-item'))
        let correctOrder;
        items.forEach((item, pos) => {
            item.style.pointerEvents = 'none';

            if (Number(item.dataset.correctOrder) === pos + 1) {
                item.style.backgroundColor = "#28a745";
                item.style.border = "2px solid #1e7e34";
            } else {
                item.style.border = "2px solid #b02a37";
                item.style.backgroundColor = "#dc3545";
            }
        });
        ({ isCorrect, correctOrder } = reportOrdering(questionBlock, questionBlock.dataset.questionIndex, false))
        if (!isCorrect) {
            feedbackText = `Correct answers: ${correctOrder}`
        }
    }
    // matching
    else if (type === 'matching') {
        const solvedArea = questionBlock.querySelector('.quiz-match-solved-area')
        const userPairs = Array.from(solvedArea.querySelectorAll('.quiz-match-pair'));
        let correctPairs = ""
        userPairs.forEach(pair => {
            pair.style.pointerEvents = 'none';

            if (pair.dataset.pairId === pair.dataset.userRight) {
                pair.classList.add('correct');
            } else {
                pair.classList.add('incorrect');
            }
        })
        const remainingItems = questionBlock.querySelectorAll('.quiz-match-item');
        remainingItems.forEach(i => i.style.pointerEvents = 'none');

        ({ isCorrect, correctPairs } = reportMatching(questionBlock, questionBlock.dataset.questionIndex, false))
        if (!isCorrect) {
            feedbackText = `Correct answer: ${correctPairs}`
        }
    }

    // feedback
    feedbackMsg = document.createElement('div');
    feedbackMsg.className = 'quiz-feedback-msg';
    questionBlock.appendChild(feedbackMsg);

    if (isCorrect) {
        feedbackMsg.innerHTML = "<strong>Correct!</strong>";
        feedbackMsg.style.backgroundColor = "#d4edda";
        feedbackMsg.style.color = "#28a745";
        feedbackMsg.style.border = "1px solid #c3e6cb";
    } else {
        feedbackMsg.innerHTML = `<strong>Incorrect.</strong> <br>${feedbackText}`;
        feedbackMsg.style.backgroundColor = "#f8d7da";
        feedbackMsg.style.color = "#dc3545";
        feedbackMsg.style.border = "1px solid #f5c6cb";
    }

    //added for explanations
    const explanationDiv = questionBlock.querySelector('.quiz-explanation');

    if (explanationDiv) {
        const markdownContent = explanationDiv.getAttribute('data-explanation-markdown');

        if (markdownContent) {
            const decoded = decodeHTMLEntities(markdownContent);
            const rendered = renderMarkdownToHTML(decoded);

            explanationDiv.innerHTML = `
                <div style="margin-top: 15px; padding: 12px; background-color: #e8f4f8; border-left: 4px solid #2196F3; border-radius: 4px;">
                    <strong style="color: #1976D2;">Explanation:</strong>
                    <div style="margin-top: 8px; color: #333;">
                        ${rendered}
                    </div>
                </div>
            `;

            // Show the div
            explanationDiv.style.display = 'block';

            // Smoothly nudge the screen so the user sees the explanation
            explanationDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    triggerMathJax();

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
    } else {
        button.classList.remove("selected");
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
    options.forEach(opt => {
        const val = opt.innerHTML;
        opt.innerHTML = val;
        dropdown.appendChild(opt);
    });

    dropdown.selectedIndex = 0;
}

// ---------- matching setup  ----------
function setupMatching(questionBlock) {
    const leftContainer = questionBlock.querySelector(".quiz-match-left");
    const rightContainer = questionBlock.querySelector(".quiz-match-right");
    const solvedArea = questionBlock.querySelector(".quiz-match-solved-area");

    const leftItems = Array.from(leftContainer.querySelectorAll(".quiz-match-item"));
    const rightItems = Array.from(rightContainer.querySelectorAll(".quiz-match-item"));

    shuffleArray(leftItems);
    shuffleArray(rightItems);

    leftItems.forEach(item => leftContainer.appendChild(item));
    rightItems.forEach(item => rightContainer.appendChild(item));

    let selectedLeft = null;
    let selectedRight = null;

    function hideItem(item) {
        item.classList.add("used");
        item.style.display = "none";
    }

    function restoreItem(item) {
        item.classList.remove("used", "selected");
        item.style.removeProperty("display");
    }

    function clearSelections() {
        leftItems.forEach(i => i.classList.remove("selected"));
        rightItems.forEach(i => i.classList.remove("selected"));
    }

    function makePair() {
        const pairId = selectedLeft.dataset.pairId;
        const rightPairId = selectedRight.dataset.pairId;

        const btn = document.createElement("button");
        btn.className = "quiz-match-pair";
        btn.dataset.pairId = pairId;
        btn.dataset.userRight = rightPairId;
        btn.textContent = `${selectedLeft.textContent} -- ${selectedRight.textContent}`;

        // Add the selected class so it turns blue immediately
        btn.classList.add("selected");

        solvedArea.appendChild(btn);

        hideItem(selectedLeft);
        hideItem(selectedRight);

        clearSelections();
        selectedLeft = null;
        selectedRight = null;

        // Undo logic
        btn.addEventListener("click", () => {
            btn.remove();
            const leftOriginal = questionBlock.querySelector(
                `.quiz-match-left .quiz-match-item[data-pair-id="${pairId}"]`
            );
            const rightOriginal = questionBlock.querySelector(
                `.quiz-match-right .quiz-match-item[data-pair-id="${rightPairId}"]`
            );
            restoreItem(leftOriginal);
            restoreItem(rightOriginal);
        });
    }

    // LEFT CLICK
    leftItems.forEach(left => {
        left.addEventListener("click", () => {
            if (left.classList.contains("used")) return;
            if (left.classList.contains("selected")) {
                clearSelections();
                selectedLeft = null;
            }
            else {
                clearSelections();
                selectedLeft = left;

                left.classList.add("selected");
            }

            // If both sides selected → create pair
            if (selectedLeft && selectedRight) makePair();
        });
    });

    // RIGHT CLICK
    rightItems.forEach(right => {
        right.addEventListener("click", () => {
            if (right.classList.contains("used")) return;
            if (right.classList.contains("selected")) {
                clearSelections();
                selectedRight = null;
            }
            else {
                clearSelections();
                selectedRight = right;

                right.classList.add("selected");
            }

            // If both sides selected → create pair
            if (selectedLeft && selectedRight) makePair();
        });
    });
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
 * SECTION 4: REPORTING ENGINE (GLOBAL SCOPE)
 * Functions responsible for grading and generating the final HTML report.
 * =============================================================================
 */

function generateReport(container, timeTakenSeconds, questionOrder) {
    const questions = container.querySelectorAll('.quiz-question-block');
    let totalScore = 0;
    let questionsHTML = "";

    // If questionOrder is undefined (safety fallback), default to original order
    if (!questionOrder || questionOrder.length !== questions.length) {
        questionOrder = Array.from({ length: questions.length }, (_, i) => i);
    }

    // Check if we have a valid time to display (i.e., the timer was active)
    const displayTime = (timeTakenSeconds !== null && !isNaN(timeTakenSeconds) && timeTakenSeconds >= 0);

    // If a time was recorded, format it; otherwise, this variable won't be used in the HTML.
    let timeTakenDisplay = '';
    if (displayTime) {
        // Use the existing formatTime utility
        timeTakenDisplay = formatTime(timeTakenSeconds);
    }

    questions.forEach((q, displayIndex) => {
        let result;
        const type = q.dataset.type;

        if (type === "ordering") {
            result = reportOrdering(q, displayIndex);
        } else if (type === "dropdown") {
            result = reportDropdown(q, displayIndex);
        } else if (type === "matching") {
            result = reportMatching(q, displayIndex);
        } else {
            result = reportQuestion(q, displayIndex);
        }

        questionsHTML += result.html;
        if (result.isCorrect) totalScore++;
    });

    const timeHtml = displayTime
        ? `<p style="font-size: 1em; margin-bottom: 20px;"> 
               Time Taken: <strong>${timeTakenDisplay}</strong>
           </p>`
        : `<p style="font-size: 1em; margin-bottom: 20px;"> </p>`;

    return `
        <div style="padding: 20px; background-color: #f8f9fa; border-top: 2px solid #333; margin-top: 20px;">
            <h3 style="margin-top: 0;">Quiz Results</h3>
            <p style="font-size: 1.2em; margin-bottom: 5px;">
                You scored <strong>${totalScore}</strong> out of <strong>${questions.length}</strong>
            </p>
            ${timeHtml}
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

    const formatReportIcons = (btns) => {
        if (btns.length === 0) return '<em>None</em>';
        return `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px;">` +
            btns.map(b => `<span class="report-answer-item">${b.innerHTML}</span>`).join("") +
            `</div>`;
    };

    const explanationHTML = extractExplanationHTML(questionElement);

    return createReportCard(
        index,
        questionText,
        isCorrect,
        formatReportIcons(userSelected),
        formatReportIcons(correctAnswers),
        explanationHTML
    );
}

function reportDropdown(questionBlock, index, feedbackEnd = true) {
    const questionTextElement = questionBlock.querySelector('.quiz-question');
    const dropdown = questionBlock.querySelector('.quiz-dropdown');

    let isCorrect = false;
    let userAnswerDisplay = "None";
    let correctAnswerDisplay = "";

    const selectedOption = dropdown.options[dropdown.selectedIndex];
    if (dropdown) {

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

    const explanationHTML = extractExplanationHTML(questionBlock);
    if (feedbackEnd)
        return createReportCard(index, questionClone.innerHTML, isCorrect, userAnswerDisplay, correctAnswerDisplay, explanationHTML);

    return {
        isCorrect,
        selectedOption: selectedOption,
        correctAnswerDisplay: correctAnswerDisplay,
        explanationHTML: explanationHTML
    };
}

function reportOrdering(questionElement, index, feedbackEnd = true) {
    const questionText = questionElement.querySelector('.quiz-question').innerHTML;
    const items = Array.from(questionElement.querySelectorAll('.quiz-order-item'));

    const isCorrect = items.every((item, pos) => Number(item.dataset.correctOrder) === pos + 1);

    const userOrder = `<div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 5px;">` +
        items.map(item => `<span class="report-order-item">${item.innerHTML}</span>`).join("") +
        `</div>`;

    const correctOrder = `<div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 5px;">` +
        items.slice()
            .sort((a, b) => Number(a.dataset.correctOrder) - Number(b.dataset.correctOrder))
            .map(item => `<span class="report-order-item">${item.innerHTML}</span>`)
            .join("") +
        `</div>`;

    if (feedbackEnd)
        return createReportCard(index, questionText, isCorrect, userOrder, correctOrder);
    return {
        isCorrect,
        correctOrder: correctOrder
    }
}

function reportMatching(questionBlock, index, feedbackEnd = true) {
    const questionText = questionBlock.querySelector(".quiz-question").innerHTML;

    // Left & right items
    const leftItems = Array.from(questionBlock.querySelectorAll(".quiz-match-left .quiz-match-item"));
    const rightItems = Array.from(questionBlock.querySelectorAll(".quiz-match-right .quiz-match-item"));

    // Lookup labels by pair-id
    const leftLabel = {};
    const rightLabel = {};

    leftItems.forEach(item => {
        leftLabel[item.dataset.pairId] = item.innerHTML.trim();
    });

    rightItems.forEach(item => {
        rightLabel[item.dataset.pairId] = item.innerHTML.trim();
    });

    // User pairs
    const pairs = Array.from(questionBlock.querySelectorAll(".quiz-match-pair"));
    const userPairs = pairs.map(p => ({
        left: p.dataset.pairId,
        right: p.dataset.userRight,
        label: `${leftLabel[p.dataset.pairId]} -- ${rightLabel[p.dataset.userRight]}`
    }));

    // Correct pairs = left.pair-id → right.pair-id (same number)
    const correctPairs = leftItems.map(item => ({
        left: item.dataset.pairId,
        right: item.dataset.pairId,
        label: `${leftLabel[item.dataset.pairId]} -- ${rightLabel[item.dataset.pairId]}`
    }));

    // Check correctness
    const isCorrect =
        userPairs.length === correctPairs.length &&
        userPairs.every(up => up.left === up.right);

    const explanationHTML = extractExplanationHTML(questionBlock);

    if (feedbackEnd)
        return createReportCard(
            index,
            questionText,
            isCorrect,
            userPairs.map(p => `<div>${p.label}</div>`).join("") || "<em>None</em>",
            correctPairs.map(p => `<div>${p.label}</div>`).join(""),
            explanationHTML
        );
    return {
        isCorrect,
        correctPairs: correctPairs.map(p => p.label).join(", "),
        explanationHTML: explanationHTML
    }
}

// EXTRACT AND RENDER EXPLANATION FROM QUESTION BLOCK ---
/**
 * Extracts explanation content from a question block and returns rendered HTML.
 * The explanation is stored in a hidden div with a data-explanation-markdown attribute.
 * This function retrieves the markdown content and renders it as HTML with proper formatting.
 * 
 * @param {HTMLElement} questionElement - The question block element
 * @returns {string} - HTML string containing the formatted explanation, or empty string if none exists
 */
function extractExplanationHTML(questionElement) {
    const explanationDiv = questionElement.querySelector('.quiz-explanation');

    if (!explanationDiv) {
        return '';
    }

    // Get the markdown content from the data attribute
    const markdownContent = explanationDiv.getAttribute('data-explanation-markdown');

    if (!markdownContent) {
        return '';
    }

    // Decode HTML entities
    const decodedContent = decodeHTMLEntities(markdownContent);

    // Render markdown to HTML (preserve links, formatting, etc.)
    const renderedHTML = renderMarkdownToHTML(decodedContent);

    return `
        <div style="margin-top: 15px; padding: 12px; background-color: #e8f4f8; border-left: 4px solid #2196F3; border-radius: 4px;">
            <strong style="color: #1976D2;">Explanation:</strong>
            <div style="margin-top: 8px; color: #333;">
                ${renderedHTML}
            </div>
        </div>
    `;
}

/**
 * Decodes HTML entities in a string.
 * Used to decode explanation content stored in data attributes.
 * 
 * @param {string} text - The text with HTML entities
 * @returns {string} - The decoded text
 */
function decodeHTMLEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

/**
 * Renders simple markdown to HTML.
 * Supports:
 * - Inline links: [text](url)
 * - Basic formatting (preserved as-is since it's already in HTML context)
 * 
 * This is a lightweight markdown renderer that preserves standard markdown links
 * and converts them to clickable HTML anchors.
 * 
 * @param {string} markdown - The markdown text
 * @returns {string} - The rendered HTML
 */
function renderMarkdownToHTML(markdown) {
    // Convert markdown links [text](url) to HTML <a> tags
    // This regex matches standard markdown link syntax
    let html = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        // Preserve the link exactly as written
        return `<a href="${url}" style="color: #1976D2; text-decoration: underline;">${text}</a>`;
    });

    return html;
}



// Reusable HTML generator for reports 
function createReportCard(index, questionText, isCorrect, userAns, correctAns, explanationHTML = '') {
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
            ${explanationHTML}
        </div>
    `;
    return { html, isCorrect };
}

/**
 * =============================================================================
 * SECTION 5: UTILITIES (GLOBAL SCOPE)
 * =============================================================================
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Converts seconds into the MM:SS format. (NEW UTILITY)
 * @param {number} totalSeconds - The total number of seconds.
 * @returns {string} - The time formatted as MM:SS.
 */
function formatTime(totalSeconds) {
    if (totalSeconds === null || isNaN(totalSeconds)) return "N/A";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return `${paddedMinutes}:${paddedSeconds}`;
}

function shuffleQuestionOrder(container, questions) {
    // Create array of indices [0, 1, 2, ...]
    const indices = Array.from({ length: questions.length }, (_, i) => i);

    // Shuffle the indices
    shuffleArray(indices);

    let questionContainer = container;
    const mainWrapper = container.querySelector(".quiz-main-wrapper");
    if (mainWrapper && mainWrapper.contains(questions[0])) {
        questionContainer = mainWrapper;
    }

    const insertionPoint = questionContainer.querySelector(".quiz-navigation") || questionContainer.querySelector(".quiz-results");

    if (!insertionPoint) {
        console.warn("Quiz navigation or results container missing. Questions appended at end.");
    }

    // Reorder DOM elements based on shuffled indices
    const questionArray = Array.from(questions);

    // Remove all questions from container
    questionArray.forEach(q => q.remove());

    // Add them back in shuffled order using insertBefore
    indices.forEach(index => {
        const questionElement = questionArray[index];

        // If an insertion point exists, insert the question before it.
        if (insertionPoint) {
            questionContainer.insertBefore(questionElement, insertionPoint);
        } else {
            // Otherwise, append it to the end (safer than crashing)
            questionContainer.appendChild(questionElement);
        }
    });

    // Return the new logical order
    return indices;
}

// for LaTeX math
function triggerMathJax() {
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }
}