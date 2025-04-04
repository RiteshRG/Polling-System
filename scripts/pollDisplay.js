import {getTimeAgo} from './dateAndTime.js';

let pollHTML = ''
const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#C9CBCF", "#A4DD00", "#76A1E5", "#FF6F61"
];


fetch("./php/fetch_polls.php")
.then(response => response.json())
.then(data => {
    console.log("Fetched Poll Data:", data);


    data.forEach((poll) => {
        let descriptionText = poll.description === "" ? "none" : poll.description;
        let optionHTML = "";
        let resultHTML = "";
        let timeAgo = getTimeAgo(poll.created_at);
        let totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

        poll.options.forEach((option,index) =>{
            let optionColor = colors[index % colors.length];
            optionHTML += `<label for="option-${poll.poll_id}-${index}">
                                <input type="radio" id="option-${poll.poll_id}-${index}" name="option-${poll.poll_id}" value="${option.id}">
                                ${option.option_text}
                            </label>`;
            
            let percentage = totalVotes ? ((option.votes / totalVotes) * 100).toFixed(2) : 0;
            resultHTML +=` <div class="option">${option.option_text}<span class="votes">    ${percentage}% (${totalVotes} votes)</span>
                                    <div class="bar super-easy" style="width:  ${percentage}%;  background-color: ${optionColor}"></div>
                                </div>`;
        })

        renderPollChart(poll);

        pollHTML += `<div class="poll-con js-poll-${poll.poll_id}">
                <form action="">
    
                    <label class="title label js-title-js-title-${poll.poll_id}">${poll.title}</label>
                    <br>
                    <span class="desc-home js-home-desc-${poll.poll_id}"  style="${poll.description === "" ? 'display: none;' : ''}"> ${descriptionText}</span>
                    <br style="${poll.description === "" ? 'display: none;' : ''}">
                        <label class="name-time label js-sub-home-${poll.poll_id}">by a ${poll.username} · ${timeAgo}</label>
                    <br><br>

                    <div class="js-con1-${poll.poll_id}">
                       <div class="dislay-poll js-dislay-poll-${poll.poll_id}">
                        <label class="make-choice-lable label">Make a choice:</label>
    
                        <div class="radio-group js-radio-group-${poll.poll_id}">
                            ${optionHTML}
                        </div>
    
                        <br>
    
                        <span><button class="vote js-vote-${poll.poll_id}" data-poll-id="${poll.poll_id}" data-owner-id="${poll.owner_id}" data-has_voted="${poll.has_voted}">${poll.has_voted === 'true' ? 'Voted' : 'Vote'}</button></span>
                        <span><button class="result-btn  js-result-${poll.poll_id}"  data-poll-id="${poll.poll_id}">Show result <i class="fa-solid fa-chart-simple"></i></i></button></span>
                       </div>


                       <div class="result-poll js-result-poll-${poll.poll_id}" style="display: none;">
                            <div class="text-poll-result-con">
                                ${resultHTML}
                                </div>
                                <br>
            
                                <span><button class="back-btn js-back-btn-${poll.poll_id}" data-poll-id="${poll.poll_id}"><i class="fa-solid fa-arrow-left"></i>  Back to poll</button></span>
                                <span><button class="pie-chart-btn js-pie-chart-btn-${poll.poll_id} js-back-btn-pie-chart-btn" data-poll-id="${poll.poll_id}">Pie chart <i class="fa-solid fa-chart-pie"></i></button></span>
                                <hr>
                            <div class="vote-num js-vote-">${totalVotes} votes</div>
                       </div>

                       <div class="display-chart js-display-chart-${poll.poll_id}" style="display: none;">
                        <div class="chart-wrapper">
                            <div class="chart-container js-chart-container">
                                <canvas id="pollChart-${poll.poll_id}" class="js-pollChart-${poll.poll_id} pollChart"></canvas>
                            </div>
                            <div class="legend-container" id="legend-${poll.poll_id}"></div>
                        </div>
                        <br>
                            <span><button class="back-btn js-back-btn-${poll.poll_id}" data-poll-id="${poll.poll_id}"><i class="fa-solid fa-arrow-left"></i>  Back to poll</button></span>
                            <hr>
                            <div class="vote-num js-vote-num">${totalVotes} votes</div>
                       </div>

                    </div>
                </form>
            </div>
            `;
    });


    document.querySelector('.poll-grid').innerHTML = pollHTML;
    document.querySelectorAll('.vote').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
    
            // Fetch the current user ID from the server
            fetch('./php/getUserId.php')
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                        return;
                    }
    
                    const currentUserId = data.user_id; // Get the current logged-in user ID
                    const pollId = button.getAttribute('data-poll-id');
                    const pollOwnerId = button.getAttribute('data-owner-id'); 
                    let hasVoted = button.getAttribute('data-has_voted'); 
                    const pollElement = document.querySelector(`.js-poll-${pollId}`); 
                    const selectedOption = pollElement.querySelector(`input[name="option-${pollId}"]:checked`);
    
                    if (!selectedOption) {
                        alert("Please select an option before voting.");
                        return;
                    }
    
                    const optionId = selectedOption.value; // Get selected option ID
                    console.log(`current id ${currentUserId}`);
                    console.log(`hasVoted type: ${typeof hasVoted}`);
    
                    // Check if the user has already voted
                    if (hasVoted === 'true') {
                        alert("You already voted on this poll.");
                        return;
                    }
    
                    // Prevent the owner from voting on their own poll
                    if (pollOwnerId === currentUserId) {
                        alert("You cannot vote on your own poll.");
                        return;
                    }
    
                    // Send the vote to the server
                    fetch('./php/vote.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            poll_id: pollId,  // Ensure poll_id is passed correctly here
                            option_id: optionId
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            alert("Vote recorded successfully!");
                            location.reload(); // Refresh to show updated results
                        }
                    })
                    .catch(error => {
                        console.log('Error while sending the vote:', error); // More detailed logging here
                    });
                })
                .catch(error => {
                    console.log('Error fetching user ID:', error); // More detailed logging here
                });
        });
    });
    

    document.querySelectorAll('.result-btn').forEach(button => {
        button.addEventListener('click', () => {  
            event.preventDefault();

            const {pollId} = button.dataset;

            if (!pollId) {
                console.error("pollId not found!");
                return;
            }

            document.querySelector(`.js-dislay-poll-${pollId}`).style.display = 'none'

            document.querySelector(`.js-result-poll-${pollId}`).style.display = 'block'
                
            document.querySelector(`.js-display-chart-${pollId}`).style.display = 'none'
        });
    });

    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', () => {  
            event.preventDefault();

            const {pollId} = button.dataset;

            if (!pollId) {
                console.error("pollId not found!");
                return;
            }

            document.querySelector(`.js-dislay-poll-${pollId}`).style.display = 'block'

            document.querySelector(`.js-result-poll-${pollId}`).style.display = 'none'
                
            document.querySelector(`.js-display-chart-${pollId}`).style.display = 'none'

        });
    });

    document.querySelectorAll('.pie-chart-btn').forEach(button => {
        button.addEventListener('click', () => {  
            event.preventDefault();

            const {pollId} = button.dataset;

            if (!pollId) {
                console.error("pollId not found!");
                return;
            }

            document.querySelector(`.js-dislay-poll-${pollId}`).style.display = 'none'

            document.querySelector(`.js-result-poll-${pollId}`).style.display = 'none'
                
            document.querySelector(`.js-display-chart-${pollId}`).style.display = 'block'

        });
    });
    
})
.catch(error => console.log("Error fetching polls:", error));



function renderPollChart(poll) {
    setTimeout(() => {
        const ctx = document.getElementById(`pollChart-${poll.poll_id}`);
        if (!ctx) {
            console.error(`Canvas element not found for poll ID: ${poll.poll_id}`);
            return;
        }

        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
        const pollData = poll.options.map(option => ({
            label: option.option_text,
            value: totalVotes ? ((option.votes / totalVotes) * 100).toFixed(2) : 0
        }));

        const colors = [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
            "#FF9F40", "#C9CBCF", "#A4DD00", "#76A1E5", "#FF6F61"
        ].slice(0, pollData.length);

        const labels = pollData.map(item => item.label);
        const dataValues = pollData.map(item => parseFloat(item.value));

        // Destroy existing chart instance before creating a new one
        if (ctx.chart) {
            ctx.chart.destroy();
        }

        ctx.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: colors,
                    borderWidth: 0 
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: 10 
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'right', 
                        labels: {
                            font: {
                                size: 14 
                            }
                        }
                    }
                }
            }
        });

    }, 500);
}



// function renderPollChart(poll) {
//     setTimeout(() => {
//         // Ensure poll options exist
//         if (!poll.options || poll.options.length === 0) {
//             console.error("No options available for poll:", poll.poll_id);
//             return;
//         }

//         const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
//         const pollData = poll.options.map(option => ({
//             label: option.option_text,
//             value: totalVotes ? ((option.votes / totalVotes) * 100).toFixed(2) : 0
//         }));

//         // Static array of 10 colors
//         const staticColors = [
//             "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
//             "#FF9F40", "#C9CBCF", "#A4DD00", "#76A1E5", "#FF6F61"
//         ];

//         // Assign colors based on the number of options available
//         const colors = staticColors.slice(0, pollData.length);

//         const labels = pollData.map(item => item.label);
//         const dataValues = pollData.map(item => item.value);

//         console.log("Labels:", labels);
//         console.log("Data Values:", dataValues);
//         console.log("Colors:", colors);

//         // Select the chart container dynamically
//         const chartSelector = `.js-pollChart-${poll.poll_id}`;
//         const chartContainer = document.querySelector(chartSelector);

//         if (!chartContainer) {
//             console.error("Chart container not found for poll:", poll.poll_id);
//             return;
//         }

//         const ctx = chartContainer.getContext('2d');

//         // Destroy previous chart instance if it exists
//         if (chartContainer.chartInstance) {
//             chartContainer.chartInstance.destroy();
//         }

//         // Create the chart
//         chartContainer.chartInstance = new Chart(ctx, {
//             type: 'pie',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     data: dataValues,
//                     backgroundColor: colors,
//                     borderWidth: 0
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     legend: {
//                         display: false
//                     },
//                     tooltip: {
//                         enabled: true
//                     }
//                 }
//             }
//         });

//         // Generate the legend dynamically
//         const legendContainer = document.getElementById(`legend-${poll.poll_id}`);
//         if (legendContainer) {
//             legendContainer.innerHTML = ""; // Clear old legend items

//             pollData.forEach((item, index) => {
//                 const legendItem = document.createElement('div');
//                 legendItem.classList.add('legend-item');

//                 const colorBox = document.createElement('div');
//                 colorBox.classList.add('legend-color');
//                 colorBox.style.backgroundColor = colors[index];

//                 const labelText = document.createElement('span');
//                 labelText.textContent = `${item.label} - ${item.value}%`;

//                 legendItem.appendChild(colorBox);
//                 legendItem.appendChild(labelText);
//                 legendContainer.appendChild(legendItem);
//             });
//         }
//     }, 500); // Small delay to ensure DOM is ready
// }


// document.addEventListener("DOMContentLoaded", async () => {
//     const pollGrid = document.querySelector(".poll-grid");
//     const userId = "currentUserId"; // Replace with actual user ID from session or authentication
    
//     try {
//         const response = await fetch("/api/getPolls"); // Replace with your actual API endpoint
//         const polls = await response.json();
        
//         pollGrid.innerHTML = ""; // Clear existing static content
        
//         polls.forEach(poll => {
//             const pollCon = document.createElement("div");
//             pollCon.classList.add("poll-con");
            
//             let optionsHTML = "";
//             poll.options.forEach((option, index) => {
//                 optionsHTML += `
//                     <label for="option${index}-${poll.id}">
//                         <input type="radio" id="option${index}-${poll.id}" name="option-${poll.id}" value="${option.optionText}">
//                         ${option.optionText}
//                     </label>
//                 `;
//             });
            
//             pollCon.innerHTML = `
//                 <form>
//                     <label class="title label">${poll.title}</label>
//                     <br>
//                     <span class="desc-home">${poll.description}</span>
//                     <br>
//                     <label class="name-time label">by ${poll.username} · ${poll.timeAgo}</label>
//                     <br><br>
//                     <div class="js-con1">
//                         <div class="dislay-poll">
//                             <label class="make-choice-lable label">Make a choice:</label>
//                             <div class="radio-group">
//                                 ${optionsHTML}
//                             </div>
//                             <br>
//                             <span><button class="vote js-vote" data-poll-id="${poll.id}" ${poll.userId === userId ? 'disabled' : ''}>Vote <i class="fa-solid fa-arrow-right"></i></button></span>
//                             <span><button class="result-btn js-result" data-poll-id="${poll.id}">Show result <i class="fa-solid fa-chart-simple"></i></button></span>
//                         </div>
//                         <div class="result-poll" style="display: none;" id="result-${poll.id}"></div>
//                         <div class="display-chart" style="display: none;" id="chart-${poll.id}">
//                             <canvas id="pollChart-${poll.id}"></canvas>
//                             <div class="legend-container" id="legend-${poll.id}"></div>
//                         </div>
//                     </div>
//                 </form>
//             `;
            
//             pollGrid.appendChild(pollCon);
//         });
//     } catch (error) {
//         console.error("Error fetching polls:", error);
//     }
// });

// // Event delegation for dynamic content

// document.addEventListener("click", async (event) => {
//     if (event.target.classList.contains("js-vote")) {
//         event.preventDefault();
//         const pollId = event.target.getAttribute("data-poll-id");
//         const selectedOption = document.querySelector(`input[name='option-${pollId}']:checked`);
        
//         if (selectedOption) {
//             await fetch("/api/vote", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ pollId, option: selectedOption.value, userId })
//             });
//             alert("Vote submitted successfully!");
//         } else {
//             alert("Please select an option to vote.");
//         }
//     }
    
//     if (event.target.classList.contains("js-result")) {
//         event.preventDefault();
//         const pollId = event.target.getAttribute("data-poll-id");
        
//         const response = await fetch(`/api/getResults?pollId=${pollId}`);
//         const resultData = await response.json();
        
//         const resultContainer = document.getElementById(`result-${pollId}`);
//         resultContainer.innerHTML = resultData.options.map(option => `
//             <div class="option">${option.optionText} <span class="votes">${option.percentage}% (${option.votes} votes)</span>
//                 <div class="bar" style="width: ${option.percentage}%;"></div>
//             </div>
//         `).join("");
        
//         resultContainer.style.display = "block";
//         document.getElementById(`chart-${pollId}`).style.display = "none";
//     }
    
//     if (event.target.classList.contains("pie-chart-btn")) {
//         event.preventDefault();
//         const pollId = event.target.getAttribute("data-poll-id");
        
//         const response = await fetch(`/api/getResults?pollId=${pollId}`);
//         const resultData = await response.json();
        
//         const ctx = document.getElementById(`pollChart-${pollId}`).getContext("2d");
//         new Chart(ctx, {
//             type: "pie",
//             data: {
//                 labels: resultData.options.map(o => o.optionText),
//                 datasets: [{
//                     data: resultData.options.map(o => o.votes),
//                     backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56"]
//                 }]
//             }
//         });
        
//         document.getElementById(`chart-${pollId}`).style.display = "block";
//         document.getElementById(`result-${pollId}`).style.display = "none";
//     }
// });




// document.querySelector('.js-result').addEventListener('click', ()=>{
//     event.preventDefault();

//     document.querySelector('.dislay-poll').style.display = 'none'

//     document.querySelector('.result-poll').style.display = 'block'
    
//     document.querySelector('.display-chart').style.display = 'none'
    
// })

// document.querySelector('.back-btn').addEventListener('click', ()=>{
//     event.preventDefault();
    
//     document.querySelector('.dislay-poll').style.display = 'block'

//     document.querySelector('.result-poll').style.display = 'none'

//     document.querySelector('.display-chart').style.display = 'none'
// })


// document.querySelector('.pie-chart-btn').addEventListener('click', ()=>{
//     event.preventDefault();

//      document.querySelector('.display-chart').style.display = 'block'
    
//     document.querySelector('.dislay-poll').style.display = 'none'

//     document.querySelector('.result-poll').style.display = 'none'
// })
