document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".quiz-answer");

    buttons.forEach(button => {
        button.addEventListener("click", function () {

            if (this.classList.contains("selected")) {
                this.classList.remove("selected");
                this.style.backgroundColor = "";
                this.style.color = "";
                return;
            }

            const isCorrect = this.dataset.correct === "true";
            this.classList.add("selected");
            this.style.backgroundColor = isCorrect ? "green" : "red";
            this.style.color = "white";

        });
    });
});
