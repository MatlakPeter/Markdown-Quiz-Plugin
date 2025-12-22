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
    const questions = container.querySelectorAll(".quiz-question-block");
    const nextBtn = container.querySelector(".quiz-nav-next");
    const prevBtn = container.querySelector(".quiz-nav-previous");
    const submitBtn = container.querySelector('.quiz-nav-submit');
    const statusText = container.querySelector(".quiz-status-text");
    const progressBar = container.querySelector(".quiz-progress-bar");
    const resultsDiv = container.querySelector(".quiz-results");
    const navContainer = container.querySelector(".quiz-navigation");

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

    // 2. Quiz State
    let currentIndex = 0;
    let feedbackType = container.getAttribute("data-feedback-mode")

    // --- NEW RANDOMIZATION STATE ---
    let questionOrder = []; // Stores the physical order of question indices [2, 0, 3, 1]
    const shouldShuffle = container.getAttribute("data-shuffle-questions") === "true";
    // --- END NEW RANDOMIZATION STATE ---

    // =========================================================
    // SECTION: INTERNAL HELPER FUNCTIONS
    // =========================================================

    function setupTimerDisplay() {
        if (timeLeft === null || timeLeft <= 0) {
            if (timerDisplayContainer) {
                timerDisplayContainer.style.display = 'none';
            }
        } else {
            timeDisplaySpan.textContent = formatTime(timeLeft);
            if (timerDisplayContainer) {
                timerDisplayContainer.style.display = 'block';
            }

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

    // --- Core Quiz Flow Functions ---

    function handleQuizStart() {
        if (startScreen) startScreen.style.display = 'none';
        if (mainWrapper) mainWrapper.style.display = 'block';

        // Ensure the display is updated after the wrapper is visible
        updateDisplay();
        startTimer();
    }

    function changeQuestion(delta) {
        // Find the actual question index in the DOM to hide it
        const currentActualIndex = questionOrder[currentIndex];
        questions[currentActualIndex].style.display = "none";

        currentIndex += delta;
        updateDisplay();
    }

    function updateDisplay() {
        // --- MODIFIED: Use questionOrder to get the correct physical question ---
        const actualIndex = questionOrder[currentIndex];
        const currentQuestion = questions[actualIndex];

        // Lazy init for ordering questions (SortableJS)
        if (currentQuestion.dataset.type === "ordering" && !currentQuestion.dataset.initialized) {
            initOrdering(currentQuestion);
            currentQuestion.dataset.initialized = "true";
        }

        // Hide all questions, then show only the current one based on the shuffled order
        questions.forEach((q, idx) => {
            q.style.display = (idx === actualIndex) ? "block" : "none";
        });

        // Update UI Text & Progress
        statusText.textContent = `Question ${currentIndex + 1}/${questions.length}`;
        const progressPercent = ((currentIndex) / questions.length) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Update Buttons visibility (no change, uses logical currentIndex)
        prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";

        const isLast = currentIndex === questions.length - 1;
        nextBtn.style.display = isLast ? "none" : "inline-block";
        submitBtn.style.display = isLast ? "inline-block" : "none";
    }

    function handleQuizSubmit(timeExpired = false) {
        stopTimer();

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = timeExpired ? "Time Expired" : "Submitted";
        }

        // Hide the active question (using the actual physical index)
        if (currentIndex >= 0 && currentIndex < questions.length) {
            const currentActualIndex = questionOrder[currentIndex];
            questions[currentActualIndex].style.display = "none";
        }
        
        if (navContainer) navContainer.style.display = "none";
        if (progressBar) progressBar.style.width = "100%";

        let timeTaken = null; 
        if (startTime !== null) {
            const endTime = Date.now();
            const elapsed = Math.floor((endTime - startTime) / 1000);
            timeTaken = elapsed; // Time taken in seconds
        }

        // Pass timeTaken (which will be null if no timer was started)
        const reportHTML = generateReport(container, timeTaken, questionOrder); 
        
        if (resultsDiv) {
            resultsDiv.innerHTML = reportHTML;
            resultsDiv.style.display = 'block';
        }
    }

    // =========================================================
    // END OF INTERNAL HELPER FUNCTIONS
    // =========================================================


    // 3. Setup Questions (Shuffle answers, init dropdowns)
    questions.forEach((questionBlock) => {
        setupQuestion(questionBlock, feedbackType);
    });

    // --- NEW RANDOMIZATION EXECUTION ---
    if (shouldShuffle) {
        // Calls the new global utility function
        questionOrder = shuffleQuestionOrder(container, questions);
    } else {
        // Keep original order: [0, 1, 2, 3, ...]
        questionOrder = Array.from({ length: questions.length }, (_, i) => i);
    }

    // 4. Start Screen / Initial Display
    setupTimerDisplay();

    if (startScreen && startBtn) {
        if (mainWrapper) mainWrapper.style.display = "none";
        if (startBtn) startBtn.addEventListener("click", handleQuizStart);
    } else {
        updateDisplay();
    }

    // 5. Bind Navigation Events
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < questions.length - 1) {
                changeQuestion(1);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                changeQuestion(-1);
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => handleQuizSubmit(false));
    }
}

/**
 * =============================================================================
 * SECTION 3: QUESTION SETUP & INTERACTION (GLOBAL SCOPE)
 * Functions responsible for preparing questions and handling user selection.
 * =============================================================================
 */
function setupQuestion(questionBlock, feedbackType) {
    const answerContainer = questionBlock.querySelector(".quiz-answer-container");
    const dropdown = questionBlock.querySelector(".quiz-dropdown");
    const answerButtons = questionBlock.querySelectorAll(".quiz-answer");
    const checkButton = questionBlock.querySelector(".quiz-btn-check-answer")

    if (checkButton) {
        checkButton.style.display = feedbackType === "immediate" ? "block" : "none";
        checkButton.addEventListener('click', function() {
            handleCheckButton(this, questionBlock);
        });
    }

    // A. Handle standard buttons (Multiple/Single Choice)
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

    // B. Handle Dropdowns
    if (dropdown) {
        setupDropdown(dropdown);
    }

    // C. Handle Matching - Assumed to be globally defined, now included below
    if (questionBlock.dataset.type === "matching") {
        setupMatching(questionBlock);
    }

}

function handleCheckButton(btn, questionBlock){
    btn.disabled = true;
    const type = questionBlock.dataset.type;
    const quizFeedback = questionBlock.querySelector('.quiz-feedback-content')
    if(quizFeedback)
        quizFeedback.style.display = "block"
    let isCorrect = false;
    let feedbackText = "";

    // single , multiple
    if(type === "single" || type === "multiple"){
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
    else if(type === 'dropdown'){
        const dropdown = questionBlock.querySelector('.quiz-dropdown')
        dropdown.disabled = true
        let selectedOption, correctAnswerDisplay;
        ({isCorrect, selectedOption, correctAnswerDisplay} = reportDropdown(questionBlock, 'SIXSEVENSIXSEVENSIXSEVEN', false))
        

        if(selectedOption.dataset.correct === 'true'){
            dropdown.style.border = "2px solid #1e7e34";
            dropdown.style.backgroundColor = "#28a745";
        }
        else{
            dropdown.style.border = "2px solid #b02a37";
            dropdown.style.backgroundColor = "#dc3545";
            feedbackText = `Correct Answer: <strong>${correctAnswerDisplay}</strong>`;
        }

    }
    // ordering
    else if(type === 'ordering'){
        const items = Array.from(questionBlock.querySelectorAll('.quiz-order-item'))
        let correctOrder;
        items.forEach((item, pos) => {
            item.style.pointerEvents = 'none';

            if(Number(item.dataset.correctOrder) === pos + 1){
                item.style.backgroundColor = "#28a745";
                item.style.border = "2px solid #1e7e34";
            } else {
                item.style.border = "2px solid #b02a37";
                item.style.backgroundColor = "#dc3545";
            }
        });
        ({isCorrect, correctOrder} = reportOrdering(questionBlock, 'ma plictisex', false))
        if(!isCorrect){
            feedbackText = `Correct answers: ${correctOrder}`
        }
    }
    // matching
    else if(type === 'matching'){
        const solvedArea = questionBlock.querySelector('.quiz-match-solved-area')
        const userPairs = Array.from(solvedArea.querySelectorAll('.quiz-match-pair'));
        let correctPairs = ""
        userPairs.forEach(pair => {
            pair.style.pointerEvents = 'none';
            
            if(pair.dataset.pairId === pair.dataset.userRight){
                pair.classList.add('correct');
            }else{
                pair.classList.add('incorrect');
            }
        })
        const remainingItems = questionBlock.querySelectorAll('.quiz-match-item');
        remainingItems.forEach(i => i.style.pointerEvents = 'none');

        ({isCorrect, correctPairs} = reportMatching(questionBlock, 'picioarele epilate sunt ca sarea in bucate', false))
        if(!isCorrect){
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
    options.forEach(opt => dropdown.appendChild(opt));

    dropdown.selectedIndex = 0;
}

// ---------- matching setup (RESTORED LOGIC) ----------
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
         questionOrder = Array.from({length: questions.length}, (_, i) => i);
    }
    
    // Check if we have a valid time to display (i.e., the timer was active)
    const displayTime = (timeTakenSeconds !== null && !isNaN(timeTakenSeconds) && timeTakenSeconds >= 0);

    // If a time was recorded, format it; otherwise, this variable won't be used in the HTML.
    let timeTakenDisplay = '';
    if (displayTime) {
        // Use the existing formatTime utility
        timeTakenDisplay = formatTime(timeTakenSeconds);
    }

    questionOrder.forEach((actualIndex, displayIndex) => {
        const q = questions[actualIndex]; 
        
        let result;
        const type = q.dataset.type;

        // Note: The index passed here is displayIndex, which correctly numbers the report 1, 2, 3...
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

    const formatList = (btns) => btns.map(b => b.innerHTML).join(', ') || '<em>None</em>';

    return createReportCard(index, questionText, isCorrect, formatList(userSelected), formatList(correctAnswers));
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
    if(feedbackEnd)
        return createReportCard(index, questionClone.innerHTML, isCorrect, userAnswerDisplay, correctAnswerDisplay);

    return {isCorrect, selectedOption: selectedOption, correctAnswerDisplay: correctAnswerDisplay}
}

function reportOrdering(questionElement, index, feedbackEnd = true) {
    const questionText = questionElement.querySelector('.quiz-question').innerHTML;
    const items = Array.from(questionElement.querySelectorAll('.quiz-order-item'));

    const isCorrect = items.every((item, pos) => Number(item.dataset.correctOrder) === pos + 1);

    const userOrder = items.map(i => i.innerHTML).join(", ");

    const correctOrder = items.slice()
        .sort((a, b) => Number(a.dataset.correctOrder) - Number(b.dataset.correctOrder))
        .map(i => i.innerHTML)
        .join(", ");

    if(feedbackEnd)
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
        leftLabel[item.dataset.pairId] = item.textContent.trim();
    });

    rightItems.forEach(item => {
        rightLabel[item.dataset.pairId] = item.textContent.trim();
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

    if(feedbackEnd)
        return createReportCard(
            index,
            questionText,
            isCorrect,
            userPairs.map(p => p.label).join(", ") || "<em>None</em>",
            correctPairs.map(p => p.label).join(", ")
        );
    return {isCorrect, 
            correctPairs: correctPairs.map(p => p.label).join(", ")
    }
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
    const indices = Array.from({length: questions.length}, (_, i) => i);
    
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