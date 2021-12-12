const allCategories = document.querySelectorAll(".category");
const modal = document.getElementById("myModal");
const categoryIds = [1892, 4483, 88, 218];
const questionContainer = {};
let score = 0;

// Fetch the questions
for (let i = 0; i < categoryIds.length; i++) {
    fetch(`https://jservice.io/api/category?id=${categoryIds[i]}`)
        .then((res) => res.json())
        .then((data) => {
            // Generate Data (organizing fetch)
            generateData(data, i);
            // Change data (actual data change)
            changeData(data, i);
        });
}

// Function to change the title and populate question container (organize fetch)
const generateData = (data, i) => {
    // Change category title
    const title = document.querySelector(`.category-${i} p`);
    title.textContent = data.title.toUpperCase();

    // Generate a random value (to get a random question from filter)
    const q100 = data.clues.filter((clue) => clue.value === 100);
    const rand100 = randomInt(0, q100.length - 1);

    const q200 = data.clues.filter((clue) => clue.value === 200);
    const rand200 = randomInt(0, q200.length - 1);

    const q300 = data.clues.filter((clue) => clue.value === 300);
    const rand300 = randomInt(0, q300.length - 1);

    const q400 = data.clues.filter((clue) => clue.value === 400);
    const rand400 = randomInt(0, q400.length - 1);

    const q500 = data.clues.filter((clue) => clue.value === 500);
    const rand500 = randomInt(0, q500.length - 1);

    // Filter by value, get a question, and add to question container (not yet randomized)
    questionContainer[data.title] = {
        100: q100[rand100],
        200: q200[rand200],
        300: q300[rand300],
        400: q400[rand400],
        500: q500[rand500],
    };
};

// Tracking question clicked and answer
let categoryPicked = 0;
let pointsPicked = 0;
let correctAnswer = "";

// Use question container
const changeData = (data, i) => {
    // Get all rows of question cards to be displayed
    const displayedQuestions = document.querySelectorAll(
        `.category-${i} .question`
    );

    // Get the questions of a specific category based on data passed using question container
    // Note: question container was filled in generateData function
    const category = questionContainer[data.title];

    for (let q = 0; q < displayedQuestions.length; q++) {
        // Get the question of a specific point value (depending on index)
        // If index is 0, it is 100. If index is 1, its is 200, etc.
        const questionObj = category[(q + 1) * 100];

        // Replace text of each box with value
        displayedQuestions[q].textContent = questionObj.value;

        // Add event listener when clicked
        displayedQuestions[q].addEventListener("click", (e) => {
            // Open modal
            modal.style.display = "block";

            // reinitialize vars to track what question was picked and answer
            categoryPicked = data.title;
            pointsPicked = questionObj.value;
            correctAnswer = questionObj.answer;
            console.log(correctAnswer);

            //  Add question text to modal
            document.querySelector(".clicked-question").textContent =
                questionObj.question;

            // Disable question
            e.target.style.visibility = "hidden";
            e.target.style.backgroundColor = "gray";
        });
    }
};

const resolveAnswer = () => {
    const answer = document.querySelector(".answer");
    if (answer.value.toLowerCase().trim() == correctAnswer.toLowerCase()) {
        score += pointsPicked;
        document.querySelector(".score").textContent = score;
    }
    answer.value = "";
    modal.style.display = "none";
};

// Resolve answer if enter button is click
document.querySelector(".enter-answer").addEventListener("click", () => resolveAnswer());

// Resolve answer if enter button key is pressed
document.querySelector(".answer").addEventListener("keyup", (e) => {
    if (e.keyCode === 13) resolveAnswer();
});

// Random number generator
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
