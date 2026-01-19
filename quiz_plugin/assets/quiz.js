window.MathJax = {
    tex: {
        inlineMath: [['$', '$']],
        displayMath: [['$$', '$$']],
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
    const questions = container.querySelectorAll(".quiz-question-block");
    const nextBtn = container.querySelector(".quiz-nav-next");
    const prevBtn = container.querySelector(".quiz-nav-previous");
    const submitBtn = container.querySelector('.quiz-nav-submit');
    const statusText = container.querySelector(".quiz-status-text");
    const progressBar = container.querySelector(".quiz-progress-bar");
    const progressBarContainer = container.querySelector(".quiz-progress-container");
    const resultsDiv = container.querySelector(".quiz-results");
    const navContainer = container.querySelector(".quiz-navigation");

    // Layout & Feedback Detection
    const layout = container.getAttribute("data-layout") || "book";
    const feedbackType = container.getAttribute("data-feedback-mode");
    const retakeBtn = container.querySelector(".quiz-btn-retake");
    const retakeFullBtn = document.createElement("button");
    retakeFullBtn.className = "quiz-btn-retake"; // Reuse existing style class
    retakeFullBtn.textContent = "Retake Full Quiz";
    retakeFullBtn.style.display = "none"; // Hidden by default
    retakeFullBtn.style.marginLeft = "10px"; // Add spacing between buttons

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

    const warningThreshold = isNaN(timeLimitSeconds) ? 0 : timeLimitSeconds * 0.10;

    // Quiz State
    let currentIndex = 0;
    let questionOrder = [];

    // Retake Mode State
    let isRetakeMode = false;
    let wrongQuestionIndices = [];

    const shouldShuffle = container.getAttribute("data-shuffle-questions") === "true";
    const allow_back = container.getAttribute("data-allow-back") ? container.getAttribute("data-allow-back") === "true" : true;

    // --- INITIALIZATION ORDER LOGIC ---
    if (shouldShuffle) {
        questionOrder = shuffleQuestionOrder(container, questions);
    } else {
        questionOrder = Array.from({ length: questions.length }, (_, i) => i);
    }
    // =========================================================
    // INTERNAL HELPER FUNCTIONS
    // =========================================================

    // Insert the new button next to the existing one
    if (retakeBtn && retakeBtn.parentNode) {
        retakeBtn.parentNode.appendChild(retakeFullBtn);
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

        // Calculate 10% of total time for the warning
        const warningThreshold = timeLimitSeconds * 0.10;

        timerInterval = setInterval(() => {
            timeLeft--;

            // Update the display text
            if (timeDisplaySpan) {
                timeDisplaySpan.textContent = formatTime(timeLeft);
            }

            // Add the warning class if time is low
            if (timeLeft <= warningThreshold) {
                container.classList.add('timer-warning');
            }

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
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        startTimer();
    }

    function changeQuestion(delta) {
        if (layout === "list") return;

        // Hide current
        const currentActualIndex = questionOrder[currentIndex];
        if (questions[currentActualIndex]) {
            questions[currentActualIndex].style.display = "none";
        }

        currentIndex += delta;
        updateDisplay();
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function updateDisplay() {
        if (layout === "list") {
            // --- LIST MODE LOGIC ---
            questions.forEach(q => q.style.display = "none");

            questionOrder.forEach((actualIndex) => {
                const q = questions[actualIndex];
                q.style.display = "block";
                q.style.borderBottom = "1px solid #ddd";
                q.style.paddingBottom = "20px";
                q.style.marginBottom = "20px";

                if (q.dataset.type === "ordering" && !q.dataset.initialized) {
                    initOrdering(q);
                    q.dataset.initialized = "true";
                }
                const checkBtn = q.querySelector(".quiz-btn-check-answer");
                if (checkBtn) {
                    checkBtn.style.display = (feedbackType === "immediate") ? "block" : "none";
                }
            });

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
            const currentSessionLength = questionOrder.length;
            const actualIndex = questionOrder[currentIndex];
            const currentQuestion = questions[actualIndex];

            if (!currentQuestion) return;

            if (currentQuestion.dataset.type === "ordering" && !currentQuestion.dataset.initialized) {
                initOrdering(currentQuestion);
                currentQuestion.dataset.initialized = "true";
            }

            questions.forEach((q) => q.style.display = "none");
            currentQuestion.style.display = "block";

            const checkBtn = currentQuestion.querySelector(".quiz-btn-check-answer");
            if (checkBtn) {
                checkBtn.style.display = (feedbackType === "immediate") ? "block" : "none";
            }

            if (statusText) {
                statusText.style.display = "block";
                statusText.textContent = `Question ${currentIndex + 1}/${currentSessionLength}`;
            }

            if (progressBar && currentSessionLength > 0) {
                const progressPercent = (currentIndex / currentSessionLength) * 100 + 1;
                progressBar.style.width = `${progressPercent}%`;
            }

            prevBtn.style.display = currentIndex === 0 || allow_back === false ? "none" : "inline-block";
            const isLast = currentIndex === currentSessionLength - 1;
            nextBtn.style.display = isLast ? "none" : "inline-block";
            submitBtn.style.display = isLast ? "inline-block" : "none";
        }
        triggerMathJax();
    }

    function handleQuizSubmit(timeExpired = false) {
        stopTimer();
        container.classList.remove('timer-warning');

        if (progressBar) progressBar.style.width = "100%";
        if (statusText) statusText.style.display = "none";

        if (mainWrapper) {
            questions.forEach(q => q.style.display = "none");
            if (navContainer) navContainer.style.display = "none";
            if (timerDisplayContainer) timerDisplayContainer.style.display = "none";
        }

        let timeTaken = null;
        if (startTime !== null) {
            const endTime = Date.now();
            timeTaken = Math.floor((endTime - startTime) / 1000);
        }

        const reportData = generateReport(container, timeTaken, questionOrder, questions, isRetakeMode);
        wrongQuestionIndices = reportData.wrongIndices;

        if (wrongQuestionIndices.length > 0) {
            retakeBtn.textContent = "Retake Missed Questions";
            retakeBtn.style.display = "inline-block";
            retakeFullBtn.style.display = "inline-block";
        } else {
            retakeBtn.textContent = "Retake Full Quiz";
            retakeBtn.style.display = "inline-block";
            retakeFullBtn.style.display = "none";
            isRetakeMode = false;
            wrongQuestionIndices = [];
        }

        if (resultsDiv) {
            resultsDiv.innerHTML = reportData.html;
            resultsDiv.style.display = 'block';
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
            triggerMathJax();
            container.classList.add("quiz-results-shown");
        }
    }

    // 1. Setup individual questions
    questions.forEach((q) => setupQuestion(q, feedbackType));

    function resetQuiz(forceFullReset = false) {
        container.classList.remove('timer-warning');
        const doPartialRetake = !forceFullReset && wrongQuestionIndices.length > 0;

        currentIndex = 0;

        if (doPartialRetake) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            isRetakeMode = true;
            questionOrder = [...wrongQuestionIndices];
            timeLeft = null;
            if (timerDisplayContainer) timerDisplayContainer.style.display = 'none';
        } else {
            isRetakeMode = false;
            timeLeft = isNaN(timeLimitSeconds) ? null : timeLimitSeconds;
            if (timeLeft !== null && timeLeft > 0) {
                if (timerDisplayContainer) timerDisplayContainer.style.display = 'block';
                setupTimerDisplay();
            }

            if (shouldShuffle) {
                questionOrder = shuffleQuestionOrder(container, questions);
            } else {
                questionOrder = Array.from({ length: questions.length }, (_, i) => i);
            }
        }

        questions.forEach(q => {
            const feedback = q.querySelector('.quiz-feedback-msg');
            if (feedback) feedback.remove();
            const explanation = q.querySelector('.quiz-explanation');
            if (explanation) explanation.style.display = 'none';
            q.querySelectorAll('.quiz-answer').forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('selected', 'correct', 'incorrect', 'shouldbecorrect');
            });
            const dropdowns = q.querySelectorAll('.quiz-dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.disabled = false;
                dropdown.selectedIndex = 0;
                dropdown.style.border = "";
                dropdown.style.backgroundColor = "";
            });
            if (q.dataset.type === 'matching') {
                const solvedArea = q.querySelector('.quiz-match-solved-area');
                if (solvedArea) solvedArea.innerHTML = '';
                q.querySelectorAll('.quiz-match-item').forEach(item => {
                    item.classList.remove('used', 'selected');
                    item.style.display = '';
                    item.style.pointerEvents = 'auto';
                });
            }
            if (q.dataset.type === 'ordering') {
                q.querySelectorAll('.quiz-order-item').forEach(item => {
                    item.style.border = "";
                    item.style.backgroundColor = "";
                    item.style.pointerEvents = 'auto';
                });
            }
            const checkBtn = q.querySelector(".quiz-btn-check-answer");
            if (checkBtn) checkBtn.disabled = false;
        });

        // Re-randomize options
        questions.forEach(q => {
            const answerContainer = q.querySelector(".quiz-answer-container");
            if (answerContainer) randomizeAnswers(answerContainer);

            const dropdownsToShuffle = q.querySelectorAll(".quiz-dropdown");
            dropdownsToShuffle.forEach(dropdown => setupDropdown(dropdown));

            if (q.dataset.type === 'matching') {
                const leftContainer = q.querySelector(".quiz-match-left");
                const rightContainer = q.querySelector(".quiz-match-right");
                if (leftContainer && rightContainer) {
                    const leftItems = Array.from(leftContainer.querySelectorAll(".quiz-match-item"));
                    const rightItems = Array.from(rightContainer.querySelectorAll(".quiz-match-item"));
                    shuffleArray(leftItems);
                    shuffleArray(rightItems);
                    leftItems.forEach(item => leftContainer.appendChild(item));
                    rightItems.forEach(item => rightContainer.appendChild(item));
                }
            }
            if (q.dataset.type === 'ordering') initOrdering(q);
        });

        if (resultsDiv) {
            resultsDiv.style.display = 'none';
            resultsDiv.innerHTML = '';
        }
        if (retakeBtn) retakeBtn.style.display = 'none';
        if (retakeFullBtn) retakeFullBtn.style.display = 'none';

        if (navContainer) navContainer.style.display = "flex";

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit";
            submitBtn.style.display = "none";
        }

        if (startScreen && !doPartialRetake) {
            startScreen.style.display = 'block';
            mainWrapper.style.display = 'none';
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            if (mainWrapper) mainWrapper.style.display = 'block';
            updateDisplay();
            if (!doPartialRetake) startTimer();
        }

        if (progressBar) progressBar.style.width = "0%";
    }

    if (startScreen && startBtn) {
        startBtn.addEventListener("click", handleQuizStart);
    } else {
        updateDisplay();
    }
    setupTimerDisplay();

    if (nextBtn) nextBtn.addEventListener("click", () => changeQuestion(1));
    if (prevBtn) prevBtn.addEventListener("click", () => changeQuestion(-1));
    if (submitBtn) submitBtn.addEventListener('click', () => handleQuizSubmit(false));
    if (retakeBtn) retakeBtn.addEventListener("click", () => resetQuiz(false));
    if (retakeFullBtn) retakeFullBtn.addEventListener("click", () => resetQuiz(true));
}

/**
 * =============================================================================
 * SECTION 3: QUESTION SETUP & INTERACTION
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

    if (checkButton) {
        checkButton.addEventListener('click', function () {
            handleCheckButton(this, questionBlock);
        });
    }

    if (answerContainer && answerButtons.length > 0) {
        randomizeAnswers(answerContainer);
        const questionType = questionBlock.getAttribute("data-type") || "multiple";
        const currentButtons = questionBlock.querySelectorAll(".quiz-answer");
        currentButtons.forEach(btn => {
            btn.addEventListener("click", function () {
                handleSelection(this, questionType, currentButtons);
            });
        });
    }

    if (dropdown) setupDropdown(dropdown);
    if (questionBlock.dataset.type === "matching") setupMatching(questionBlock);
}

function handleCheckButton(btn, questionBlock) {
    btn.disabled = true;
    const type = questionBlock.dataset.type;
    const quizFeedback = questionBlock.querySelector('.quiz-feedback-content')
    if (quizFeedback) quizFeedback.style.display = "block"

    let isCorrect = false;
    let feedbackText = "";

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
    else if (type === 'dropdown') {
        const dropdowns = questionBlock.querySelectorAll('.quiz-dropdown');
        let totalIsCorrect = true;
        let correctTexts = [];

        dropdowns.forEach(dropdown => {
            dropdown.disabled = true;
            const selectedOption = dropdown.options[dropdown.selectedIndex];
            const isThisCorrect = selectedOption && selectedOption.dataset.correct === 'true';
            let correctText = "";
            dropdown.querySelectorAll('option').forEach(o => {
                if (o.dataset.correct === "true") correctText = o.textContent;
            });
            correctTexts.push(correctText);

            if (isThisCorrect) {
                dropdown.style.border = "2px solid #1e7e34";
                dropdown.style.backgroundColor = "#28a745";
            } else {
                dropdown.style.border = "2px solid #b02a37";
                dropdown.style.backgroundColor = "#dc3545";
                totalIsCorrect = false;
            }
        });

        isCorrect = totalIsCorrect;
        if (!isCorrect) {
            feedbackText = `Correct Answers: <strong>${correctTexts.join(" | ")}</strong>`;
        }
    }
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
        if (!isCorrect) feedbackText = `Correct answers: ${correctOrder}`
    }
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
        if (!isCorrect) feedbackText = `Correct answer: ${correctPairs}`
    }

    let feedbackMsg = document.createElement('div');
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

    const explanationDiv = questionBlock.querySelector('.quiz-explanation');
    if (explanationDiv) {
        const markdownContent = explanationDiv.getAttribute('data-explanation-markdown');
        if (markdownContent) {
            const decoded = decodeHTMLEntities(markdownContent);
            const rendered = renderMarkdownToHTML(decoded);
            explanationDiv.innerHTML = `
                <div class="quiz-explanation-box">
                    <strong class="quiz-explanation-header">Explanation:</strong>
                    <div class="quiz-explanation-text">${rendered}</div>
                </div>
            `;
            explanationDiv.style.display = 'block';
            explanationDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    triggerMathJax();
}

function handleSelection(clickedButton, type, allButtons) {
    const isSelected = clickedButton.classList.contains("selected");
    if (type === "single") {
        allButtons.forEach(btn => toggleButtonState(btn, false));
        if (!isSelected) toggleButtonState(clickedButton, true);
    } else {
        toggleButtonState(clickedButton, !isSelected);
    }
}

function toggleButtonState(button, select) {
    if (select) button.classList.add("selected");
    else button.classList.remove("selected");
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
        btn.innerHTML = `${selectedLeft.innerHTML} -- ${selectedRight.innerHTML}`;
        btn.classList.add("selected");

        solvedArea.appendChild(btn);
        hideItem(selectedLeft);
        hideItem(selectedRight);
        clearSelections();
        selectedLeft = null;
        selectedRight = null;

        btn.addEventListener("click", () => {
            btn.remove();
            const leftOriginal = questionBlock.querySelector(`.quiz-match-left .quiz-match-item[data-pair-id="${pairId}"]`);
            const rightOriginal = questionBlock.querySelector(`.quiz-match-right .quiz-match-item[data-pair-id="${rightPairId}"]`);
            restoreItem(leftOriginal);
            restoreItem(rightOriginal);
        });
    }

    leftItems.forEach(left => {
        left.addEventListener("click", () => {
            if (left.classList.contains("used")) return;
            if (left.classList.contains("selected")) {
                clearSelections();
                selectedLeft = null;
            } else {
                clearSelections();
                selectedLeft = left;
                left.classList.add("selected");
            }
            if (selectedLeft && selectedRight) makePair();
        });
    });

    rightItems.forEach(right => {
        right.addEventListener("click", () => {
            if (right.classList.contains("used")) return;
            if (right.classList.contains("selected")) {
                clearSelections();
                selectedRight = null;
            } else {
                clearSelections();
                selectedRight = right;
                right.classList.add("selected");
            }
            if (selectedLeft && selectedRight) makePair();
        });
    });
}

function initOrdering(questionElement) {
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
 * =============================================================================
 */
function generateReport(container, timeTakenSeconds, questionOrder, questions, isRetakeMode = false) {
    let totalScore = 0;
    let questionsHTML = "";
    let wrongIndices = [];

    if (!questionOrder) {
        questionOrder = Array.from({ length: questions.length }, (_, i) => i);
    }

    const displayTime = (timeTakenSeconds !== null && !isNaN(timeTakenSeconds) && timeTakenSeconds >= 0);
    let timeTakenDisplay = '';

    if (displayTime) {
        timeTakenDisplay = formatTime(timeTakenSeconds);
    }

    questionOrder.forEach((actualIndex, displayIndex) => {
        const q = questions[actualIndex];
        let result;
        const type = q.dataset.type;

        if (type === "ordering") result = reportOrdering(q, displayIndex);
        else if (type === "dropdown") result = reportDropdown(q, displayIndex);
        else if (type === "matching") result = reportMatching(q, displayIndex);
        else result = reportQuestion(q, displayIndex);

        questionsHTML += result.html;

        if (result.isCorrect) {
            totalScore++;
        } else {
            wrongIndices.push(actualIndex);
        }
    });

    let comparisonHtml = `<p style="margin-bottom: 5px;">
                You scored <strong>${totalScore}</strong> out of <strong>${questionOrder.length}</strong>
            </p>`;

    const baselineStr = container.getAttribute("data-baseline");
    if (baselineStr && !isRetakeMode) {
        const baseline = parseFloat(baselineStr);
        // Use questions.length from the passed array
        const maxScore = questions.length;
        if (!isNaN(baseline)) {
            const hasPassed = totalScore >= baseline;
            const statusText = hasPassed ? "PASSED" : "FAILED";
            const color = hasPassed ? "green" : "red";
            comparisonHtml = `
                <p style="font-size: 1.2em; margin-bottom: 5px; color: var(--md-typeset-color);">
                    <span style="font-weight: bold; color: ${color};">Result: ${statusText}</span> <br>
                        You scored <strong>${totalScore}</strong> out of <strong>${questionOrder.length}</strong> | Required: <strong>${baseline}</strong> out of <strong>${maxScore}</strong>
                    </span>
                </p>
            `;
        }
    }

    const timeHtml = (displayTime && !isRetakeMode)
        ? `<p style="font-size: 1em; margin-bottom: 20px;">Time Taken: <strong>${timeTakenDisplay}</strong></p>`
        : `<p style="font-size: 1em; margin-bottom: 20px;"> </p>`;

    const finalHTML = `
        <div style="padding: 20px; background-color: #f8f9fa; border-top: 2px solid #333; margin-top: 20px;">
            <h3 style="margin-top: 0;">Quiz Results</h3>
            <p style="font-size: 1.2em; margin-bottom: 5px;">${comparisonHtml}</p>
            ${timeHtml}
            <div class="quiz-review-list">${questionsHTML}</div>
        </div>
    `;

    return {
        html: finalHTML,
        wrongIndices: wrongIndices
    };
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

    // Format answers with partial coloring
    const formatReportIcons = (btns, isUserAnswer = false) => {
        if (btns.length === 0) return '<em>None</em>';

        return `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px;">` +
            btns.map(b => {
                const isCorrect = b.dataset.correct === "true";
                const wasSelected = b.classList.contains("selected");
                let color = "black";

                if (isUserAnswer) {
                    // For user answers: green if correct AND selected, red if incorrect AND selected
                    if (wasSelected) {
                        color = isCorrect ? "green" : "red";
                    }
                } else {
                    // For correct answers: show all correct answers in green
                    color = isCorrect ? "green" : "black";
                }

                return `<span class="report-answer-item" style="color: ${color};">${b.innerHTML}</span>`;
            }).join("") +
            `</div>`;
    };

    const explanationHTML = extractExplanationHTML(questionElement);

    return createReportCard(
        index,
        questionText,
        isCorrect,
        formatReportIcons(allAnswers.filter(b => b.classList.contains("selected")), true),
        formatReportIcons(correctAnswers, false),
        explanationHTML
    );
}

function reportDropdown(questionBlock, index, feedbackEnd = true) {
    const questionTextElement = questionBlock.querySelector('.quiz-question');
    const dropdowns = questionBlock.querySelectorAll('.quiz-dropdown');

    let correctCount = 0;
    let userAnswers = [];
    let correctAnswers = [];

    dropdowns.forEach((dropdown) => {
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        let correctText = "";

        // Find correct text for this specific dropdown
        dropdown.querySelectorAll('option').forEach(option => {
            if (option.dataset.correct === "true") correctText = option.textContent;
        });

        const userText = (selectedOption && !selectedOption.disabled) ? selectedOption.textContent : "None";
        const isThisCorrect = (selectedOption && selectedOption.dataset.correct === "true");

        if (isThisCorrect) correctCount++;

        userAnswers.push(userText);
        correctAnswers.push(correctText);
    });

    // A question is only "Correct" if ALL dropdowns are correct
    const isTotalCorrect = (correctCount === dropdowns.length);

    // Color code individual dropdown answers
    const userDisplay = userAnswers.map((answer, i) => {
        const color = (userAnswers[i] === correctAnswers[i]) ? "green" : "red";
        return `<span style="color: ${color}">${answer}</span>`;
    }).join(" | ");

    const correctDisplay = correctAnswers.map(answer =>
        `<span style="color: green">${answer}</span>`
    ).join(" | ");

    // Clone question for report view
    const questionClone = questionTextElement.cloneNode(true);
    questionClone.querySelectorAll('.quiz-dropdown').forEach(d => {
        const placeholder = document.createElement('span');
        placeholder.textContent = ' [...] ';
        placeholder.style.fontWeight = "bold";
        d.parentNode.replaceChild(placeholder, d);
    });

    const explanationHTML = extractExplanationHTML(questionBlock);

    if (feedbackEnd) {
        return createReportCard(index, questionClone.innerHTML, isTotalCorrect, userDisplay, correctDisplay, explanationHTML);
    }

    return {
        isCorrect: isTotalCorrect,
        correctAnswerDisplay: correctDisplay,
        explanationHTML: explanationHTML
    };
}

function reportOrdering(questionElement, index, feedbackEnd = true) {
    const questionText = questionElement.querySelector('.quiz-question').innerHTML;
    const items = Array.from(questionElement.querySelectorAll('.quiz-order-item'));
    const isCorrect = items.every((item, pos) => Number(item.dataset.correctOrder) === pos + 1);

    const userOrder = `<div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 5px;">` +
        items.map((item, pos) => {
            const isCorrect = Number(item.dataset.correctOrder) === pos + 1;
            const color = isCorrect ? "green" : "red";
            return `<span class="report-order-item" style="color: ${color};">${item.innerHTML}</span>`;
        }).join("") + `</div>`;

    const correctOrder = `<div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 5px;">` +
        items.slice()
            .sort((a, b) => Number(a.dataset.correctOrder) - Number(b.dataset.correctOrder))
            .map(item => `<span class="report-order-item">${item.innerHTML}</span>`)
            .join("") + `</div>`;

    const explanationHTML = extractExplanationHTML(questionElement);
    if (feedbackEnd)
        return createReportCard(index, questionText, isCorrect, userOrder, correctOrder, explanationHTML);
    return { isCorrect, correctOrder, explanationHTML };
}

function reportMatching(questionBlock, index, feedbackEnd = true) {
    const questionText = questionBlock.querySelector(".quiz-question").innerHTML;
    const leftItems = Array.from(questionBlock.querySelectorAll(".quiz-match-left .quiz-match-item"));
    const rightItems = Array.from(questionBlock.querySelectorAll(".quiz-match-right .quiz-match-item"));

    const leftLabel = {};
    const rightLabel = {};

    // Map the IDs to their text content for easy lookup
    leftItems.forEach(item => {
        leftLabel[item.dataset.pairId] = item.textContent.trim();
    });
    rightItems.forEach(item => {
        rightLabel[item.dataset.pairId] = item.textContent.trim();
    });

    const pairs = Array.from(questionBlock.querySelectorAll(".quiz-match-pair"));
    const userPairs = pairs.map(p => ({
        left: p.dataset.pairId,
        right: p.dataset.userRight,
        isCorrect: p.dataset.pairId === p.dataset.userRight
    }));

    // Logic to determine if the whole question is correct
    const allLeftItemsMatched = userPairs.length === leftItems.length;
    const allPairsCorrect = userPairs.length > 0 && userPairs.every(up => up.left === up.right);
    const isCorrect = allPairsCorrect && allLeftItemsMatched;

    let userPairsFormatted = "";

    // Track which left items were actually used by the user
    const matchedLeftIds = userPairs.map(up => up.left);

    // 1. Format the pairs the user actually created
    userPairs.forEach(userPair => {
        const leftText = leftLabel[userPair.left] || "Unknown";
        const rightText = rightLabel[userPair.right] || "Not matched";
        const color = userPair.isCorrect ? "green" : "red";
        userPairsFormatted += `<div style="color: ${color};">${leftText} -- ${rightText}</div>`;
    });

    // 2. NEW: Identify and add items the user skipped
    leftItems.forEach(item => {
        const leftId = item.dataset.pairId;
        if (!matchedLeftIds.includes(leftId)) {
            const leftText = leftLabel[leftId];
            // Explicitly mark skipped items as red with "No selection"
            userPairsFormatted += `<div style="color: red;">${leftText} -- <span style="font-style: italic;">(No selection)</span></div>`;
        }
    });

    // Generate the correct answer key for the report
    const correctPairsFormatted = leftItems.map(item => {
        const id = item.dataset.pairId;
        return `<div style="color: green;">${leftLabel[id]} -- ${rightLabel[id]}</div>`;
    }).join("");

    const explanationHTML = extractExplanationHTML(questionBlock);

    if (feedbackEnd) {
        return createReportCard(index, questionText, isCorrect, userPairsFormatted, correctPairsFormatted, explanationHTML);
    }

    return { isCorrect };
}

function extractExplanationHTML(questionElement) {
    const explanationDiv = questionElement.querySelector('.quiz-explanation');
    if (!explanationDiv) return '';
    const markdownContent = explanationDiv.getAttribute('data-explanation-markdown');
    if (!markdownContent) return '';
    const decodedContent = decodeHTMLEntities(markdownContent);
    const renderedHTML = renderMarkdownToHTML(decodedContent);
    return `
        <div class="quiz-explanation-box">
            <strong class="quiz-explanation-title">Explanation:</strong>
            <div class="quiz-explanation-content">${renderedHTML}</div>
        </div>
    `;
}

function decodeHTMLEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

function renderMarkdownToHTML(markdown) {
    let html = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        return `<a href="${url}" style="color: #1976D2; text-decoration: underline;">${text}</a>`;
    });
    return html;
}

function createReportCard(index, questionText, isCorrect, userAns, correctAns, explanationHTML = '') {
    const statusIcon = isCorrect ? '✅' : '❌';
    const feedbackColor = isCorrect ? 'var(--quiz-report-correct)' : 'var(--quiz-report-incorrect)';
    const html = `
        <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #ccc; border-left: 5px solid ${feedbackColor}; border-radius: 5px;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">
                ${index + 1}. ${questionText} ${statusIcon}
            </p>
            <div style="font-size: 0.95em;">
                <div style="margin-bottom: 4px;">
                    <strong>Your Answer:</strong> 
                    <span style="color: ${feedbackColor}; font-weight: bold;">${userAns}</span>
                </div>
                <div>
                    <strong>Correct Answer:</strong> 
                    <span style="color: var(--quiz-report-correct); font-weight: bold;">${correctAns}</span>
                </div>
            </div>
            ${explanationHTML}
        </div>
    `;
    return { html, isCorrect };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function formatTime(totalSeconds) {
    if (totalSeconds === null || isNaN(totalSeconds)) return "N/A";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
}

function shuffleQuestionOrder(container, questions) {
    const indices = Array.from({ length: questions.length }, (_, i) => i);
    shuffleArray(indices);
    let questionContainer = container;
    const mainWrapper = container.querySelector(".quiz-main-wrapper");
    if (mainWrapper && mainWrapper.contains(questions[0])) {
        questionContainer = mainWrapper;
    }
    const insertionPoint = questionContainer.querySelector(".quiz-navigation") || questionContainer.querySelector(".quiz-results");
    const questionArray = Array.from(questions);
    questionArray.forEach(q => q.remove());
    indices.forEach(index => {
        const questionElement = questionArray[index];
        if (insertionPoint) {
            questionContainer.insertBefore(questionElement, insertionPoint);
        } else {
            questionContainer.appendChild(questionElement);
        }
    });
    return indices;
}

function triggerMathJax() {
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }
}