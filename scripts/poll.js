document.addEventListener("DOMContentLoaded", () => {
    togglePollType(); // Initialize with Text Poll options
});

function togglePollType() {
    let pollType = document.getElementById("pollType").value;
    let textOptionsContainer = document.getElementById("textOptionsContainer");
    let imageOptionsContainer = document.getElementById("imageOptionsContainer");
    let addTextOptionBtn = document.getElementById("addTextOptionBtn");
    let addImageOptionBtn = document.getElementById("addImageOptionBtn");

    // Reset containers
    textOptionsContainer.innerHTML = "";
    imageOptionsContainer.innerHTML = "";

    if (pollType === "text") {
        textOptionsContainer.style.display = "block";
        imageOptionsContainer.style.display = "none";
        addTextOptionBtn.style.display = "block";
        addImageOptionBtn.style.display = "none";

        // Start with 2 text options
        for (let i = 0; i < 2; i++) addTextOption();
    } else {
        textOptionsContainer.style.display = "none";
        imageOptionsContainer.style.display = "block";
        addTextOptionBtn.style.display = "none";
        addImageOptionBtn.style.display = "block";

        // Start with 2 image options
        for (let i = 0; i < 2; i++) addImageOption();
    }
}

function addTextOption() {
    let textOptionsContainer = document.getElementById("textOptionsContainer");

    if (textOptionsContainer.children.length >= 5) {
        alert("You can only add up to 5 text options.");
        return;
    }

    let optionDiv = document.createElement("div");
    optionDiv.classList.add("option");

    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.classList.add("optionInput");
    inputField.placeholder = `Option ${textOptionsContainer.children.length + 1}`;

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = () => textOptionsContainer.removeChild(optionDiv);

    optionDiv.appendChild(inputField);
    optionDiv.appendChild(deleteBtn);
    textOptionsContainer.appendChild(optionDiv);
}

function addImageOption() {
    let imageOptionsContainer = document.getElementById("imageOptionsContainer");

    if (imageOptionsContainer.children.length >= 4) {
        alert("You can only add up to 4 image options.");
        return;
    }

    let optionDiv = document.createElement("div");
    optionDiv.classList.add("image-option");

    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = function () {
        let reader = new FileReader();
        reader.onload = function (e) {
            let imgPreview = document.createElement("img");
            imgPreview.src = e.target.result;
            imgPreview.classList.add("image-preview");

            optionDiv.innerHTML = "";
            optionDiv.appendChild(imgPreview);
            optionDiv.appendChild(deleteBtn);
        };
        reader.readAsDataURL(fileInput.files[0]);
    };

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = () => imageOptionsContainer.removeChild(optionDiv);

    optionDiv.appendChild(fileInput);
    optionDiv.appendChild(deleteBtn);
    imageOptionsContainer.appendChild(optionDiv);
}

function createPoll() {
    let question = document.getElementById("pollQuestion").value;
    let pollType = document.getElementById("pollType").value;
    let previewQuestion = document.getElementById("previewQuestion");
    let previewOptions = document.getElementById("previewOptions");

    if (question.trim() === "") {
        alert("Please enter a poll question.");
        return;
    }

    previewQuestion.innerText = question;
    previewOptions.innerHTML = "";

    if (pollType === "text") {
        let options = document.querySelectorAll("#textOptionsContainer .optionInput");
        if (options.length < 2) {
            alert("Please add at least 2 text options.");
            return;
        }
        options.forEach(option => {
            let li = document.createElement("li");
            li.innerText = option.value;
            previewOptions.appendChild(li);
        });
    } else {
        let images = document.querySelectorAll("#imageOptionsContainer .image-preview");
        if (images.length < 2) {
            alert("Please add at least 2 image options.");
            return;
        }
        images.forEach(img => {
            let li = document.createElement("li");
            li.appendChild(img.cloneNode(true));
            previewOptions.appendChild(li);
        });
    }

    document.getElementById("pollPreview").style.display = "block";
}
