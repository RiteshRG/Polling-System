import {getTimeAgo} from './dateAndTime.js';

let pollHTML = ''
const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#C9CBCF", "#A4DD00", "#76A1E5", "#FF6F61"
];

fetch("./php/fetch_my_polls.php")
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


                       <div class="result-poll js-result-poll-${poll.poll_id}" style="display: block;">
                            <div class="text-poll-result-con">
                                ${resultHTML}
                                </div>
                                <br>
            
                                <span><button class="delete-btn back-btn js-delete-btn-${poll.poll_id}" data-poll-id="${poll.poll_id}"><i class="fa-solid fa-trash"></i>   Delete</button></span>
                                <span><button class="pie-chart-btn js-pie-chart-btn-${poll.poll_id} js-back-btn-pie-chart-btn" data-poll-id="${poll.poll_id}">Pie chart <i class="fa-solid fa-chart-pie"></i></button></span>
                                <hr>
                            <div class="vote-num js-vote-">${totalVotes} votes</div>
                       </div>

                       <div class="display-chart js-display-chart-${poll.poll_id}" style="display: none;">
                        <div class="chart-wrapper">
                            <div class="chart-container js-chart-container">
                                <canvas id="pollChart-${poll.poll_id}" class="js-pollChart-${poll.poll_id}"></canvas>
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

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const {pollId} = button.dataset;
            if (!pollId) {
                console.error("pollId not found!");
                return;
            }

            // Ask for confirmation before deletion
            const confirmation = confirm("Are you sure you want to delete this poll?");
            if (confirmation) {
                // Proceed to delete the poll from the database
                fetch(`./php/delete_poll.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ poll_id: pollId })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        // If successful, remove the poll from the UI
                        document.querySelector(`.js-poll-${pollId}`).remove();
                        location.reload();
                        
                    } else {
                        alert("Error deleting poll. Please try again.");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Error deleting poll. Please try again.");
                });
            }
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


            document.querySelector(`.js-result-poll-${pollId}`).style.display = 'block'
                
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

            document.querySelector(`.js-result-poll-${pollId}`).style.display = 'none'
                
            document.querySelector(`.js-display-chart-${pollId}`).style.display = 'block'

        });
    });
})
.catch(error => {
    console.error("Error fetching polls:", error);
    // alert("Error fetching polls. Please try again later.");
});



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
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

    }, 500);
}
