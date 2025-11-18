document.addEventListener('DOMContentLoaded', function() { // wait for the entire page to load
    // Get all quiz answer buttons
    const answerButtons = document.querySelectorAll('.quiz-answer'); // get a list of all buttons with class 'quiz-answer'
    
    answerButtons.forEach(button => { // loop through each button
        button.addEventListener('click', function() { // add click event listener
            // Check if this button was already clicked
            if (this.classList.contains('answered')) {
                return; // Don't allow re-clicking
            }
            
            // Get the correct answer status
            const isCorrect = this.getAttribute('data-correct') === 'true'; // check the data-correct attribute of the html button
            
            // Disable all buttons in this quiz question
            const quizBox = this.closest('.quiz-box'); // to select only the buttons in the currently clicked quiz question
            const allButtons = quizBox.querySelectorAll('.quiz-answer');
            // const allButtons = document.querySelectorAll('.quiz-answer'); // !! WRONG CODE - selects all buttons on the page, not just in the current quiz
            allButtons.forEach(btn => {
                btn.classList.add('answered');
                btn.style.cursor = 'not-allowed';
            });
            
            // Color the clicked button
            if (isCorrect) {
                this.style.backgroundColor = '#4CAF50'; // Green
                this.style.color = 'white';
            } else {
                this.style.backgroundColor = '#f44336'; // Red
                this.style.color = 'white';
                
                // Also highlight the correct answer (so the user can see which one was correct)
                allButtons.forEach(btn => {
                    if (btn.getAttribute('data-correct') === 'true') {
                        btn.style.backgroundColor = '#4CAF50';
                        btn.style.color = 'white';
                    }
                });
            }
        });
    });
});