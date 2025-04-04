document.addEventListener("DOMContentLoaded", function () {
    const pollForm = document.querySelector(".js-create-poll-form");

    pollForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const title = document.querySelector(".js-create-title").value.trim();
        const description = document.querySelector(".js-des-textarea").value.trim();
        const optionInputs = document.querySelectorAll(".js-options input");

        let options = [];
        optionInputs.forEach(input => {
            let text = input.value.trim();
            if (text) options.push(text);
        });

        // 🛑 Validation checks
        if (title === "") {
            alert("Title is required!");
            return;
        }
        if (title.length > 255) {
            alert("Title must be within 255 characters!");
            return;
        }
        if (options.length < 2) {
            alert("At least 2 options are required!");
            return;
        }
        if (options.length > 10) {
            alert("Maximum 10 options allowed!");
            return;
        }
        for (let option of options) {
            if (option.length > 255) {
                alert("Each option must be within 255 characters!");
                return;
            }
        }

        // Send data using Fetch API
        fetch("./php/insert/store_poll.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ 
                title: title, 
                description: description, 
                options: JSON.stringify(options) 
            })
        })
        .then(response => response.text())  
        .then(data => {
            console.log("Raw Response:", data);  
        
            try {
                let jsonData = JSON.parse(data);  // Try parsing as JSON
                if (jsonData.status === "success") {
                    alert("Poll created successfully!");
                    window.location.reload();
                } else {
                    alert("Error: " + jsonData.message);
                }
            } catch (error) {
                console.error("Invalid JSON response:", data);  // Log error if parsing fails
            }
        })
        .catch(error => console.error("Fetch error:", error));
    });
});
