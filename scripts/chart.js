const pollData = [
    { label: "Option 1", value: 50.00 },
    { label: "Option 2", value: 20.00 },
    { label: "Option 3", value: 30.00 }
];

// Static array of 10 colors
const staticColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#C9CBCF", "#A4DD00", "#76A1E5", "#FF6F61"
];

// Assign colors based on the number of options available
const colors = staticColors.slice(0, pollData.length);

const labels = pollData.map(item => item.label);
const dataValues = pollData.map(item => item.value);

console.log("Labels:", labels);
console.log("Data Values:", dataValues);
console.log("Colors:", colors);

const ctx = document.getElementById('pollChart').getContext('2d');
new Chart(ctx, {
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
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    }
});

const legendContainer = document.getElementById('legend');
pollData.forEach((item, index) => {
    const legendItem = document.createElement('div');
    legendItem.classList.add('legend-item');

    const colorBox = document.createElement('div');
    colorBox.classList.add('legend-color');
    colorBox.style.backgroundColor = colors[index];
    
    const labelText = document.createElement('span');
    labelText.textContent = item.label;
    
    legendItem.appendChild(colorBox);
    legendItem.appendChild(labelText);
    legendContainer.appendChild(legendItem);
});
