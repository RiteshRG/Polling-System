const addDesbtn = document.querySelector('.js-des-btn');
const desArea = document.querySelector('.js-des-area');
const addOptionBtn = document.querySelector(".js-option-btn");
const minOptionMsg = document.querySelector(".min-option-msg");
const optionsContainer = document.querySelector(".js-options");

let optionCount = 0; // Start from 0 and increment as we add options

// Description button event
addDesbtn.addEventListener('click', (event) => {
    event.preventDefault();
    addDesbtn.style.display = 'none';
    desArea.classList.remove('hidden');
});

// Function to add an option
function addOption() {
    if (optionCount < 10) {
        optionCount++;
        if (optionCount < 2) {
            minOptionMsg.style.display = "block";
        } else {
            minOptionMsg.style.display = "none";
        }

        const newOptionDiv = document.createElement("div");
        newOptionDiv.classList.add("option-div");

        newOptionDiv.innerHTML = `
            <input type="text" placeholder="Option ${optionCount}">
            <button class="cancel-btn"><i class="fa-solid fa-xmark"></i></button>
        `;

        optionsContainer.appendChild(newOptionDiv);

        // Remove option when clicking the cancel button
        newOptionDiv.querySelector(".cancel-btn").addEventListener("click", function () {
            newOptionDiv.remove();
            optionCount--;
            updateOptionNumbers();
            if (optionCount < 2) {
                minOptionMsg.style.display = "block";
            } else {
                minOptionMsg.style.display = "none";
            }
        });

        updateOptionNumbers();
    } else {
        alert("Maximum 10 options allowed!");
    }
}

// Function to update option numbers
function updateOptionNumbers() {
    const optionInputs = optionsContainer.querySelectorAll(".option-div input");
    optionInputs.forEach((input, index) => {
        input.setAttribute("placeholder", `Option ${index + 1}`);
    });
}

// Load at least 2 options on page load
document.addEventListener("DOMContentLoaded", function () {
    addOption();
    addOption();

    addOptionBtn.addEventListener("click", function (event) {
        event.preventDefault();
        addOption();
    });

    // document.getElementById("poll-type").addEventListener("change", function () {
    //     const textOptions = document.querySelector(".js-options");
    //     const imageOptions = document.querySelector(".options-container");

    //     if (this.value === "text poll") {
    //         textOptions.classList.remove("hiddenn");
    //         addOptionBtn.classList.remove("hiddenn");
    //         imageOptions.style.display = 'none';
    //     } else {
    //         textOptions.classList.add("hiddenn");
    //         addOptionBtn.classList.add("hiddenn");
    //         imageOptions.style.display = 'inline';
    //         minOptionMsg.style.display = "none";
    //     }
    // });
});
