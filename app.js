// Performance tracking algorithms
function addUpToFirst(n) {
    let total = 0;
    for (let i = 0; i <= n; i++) {
        total += i;
    }
    return total;
}

function addUpToSecond(n) {
    return n * (n + 1) / 2;
}

// Chart configuration
const ctx = document.getElementById('performanceChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'n'
                },
                ticks: {
                    callback: function(value) {
                        return (value).toFixed(0);
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Time Elapsed (seconds)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'center',
                labels: {
                    boxWidth: 15,
                    padding: 10
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Time: ${context.parsed.y.toFixed(6)} seconds`;
                    }
                }
            }
        }
    }
});

// Dataset colors for different algorithms
const colors = {
    addUpToFirst: '#007bff',
    addUpToSecond: '#6c757d'
};

// Store the results for each algorithm
const results = {
    addUpToFirst: { n: [], time: [] },
    addUpToSecond: { n: [], time: [] }
};

// Function to measure execution time
function measureTime(fn, n) {
    const start = performance.now();
    fn(n);
    const end = performance.now();
    return (end - start) / 1000; // Convert to seconds
}

// Function to update the chart with new data
function updateChart() {
    // Check if datasets already exist
    const existingDatasets = new Set(chart.data.datasets.map(ds => ds.label));
    
    Object.keys(results).forEach(algorithm => {
        const data = results[algorithm].n.map((n, i) => ({
            x: n,
            y: results[algorithm].time[i]
        }));

        if (existingDatasets.has(algorithm)) {
            // Update existing dataset
            const datasetIndex = chart.data.datasets.findIndex(ds => ds.label === algorithm);
            chart.data.datasets[datasetIndex].data = data;
        } else {
            // Add new dataset
            chart.data.datasets.push({
                label: algorithm,
                data: data,
                backgroundColor: colors[algorithm],
                borderColor: colors[algorithm],
                pointRadius: 5,
                pointHoverRadius: 8
            });
        }
    });
    
    chart.update();
}

// Function to run the selected algorithm
function runAlgorithm(algorithmName) {
    const n = parseInt(document.getElementById('n-value').value);
    if (isNaN(n) || n < 0) {
        alert('Please enter a valid positive number');
        return;
    }

    const algorithm = window[algorithmName];
    const time = measureTime(algorithm, n);

    results[algorithmName].n.push(n);
    results[algorithmName].time.push(time);

    updateChart();
}

// Event listener for chart click to remove data points
chart.canvas.addEventListener('click', (event) => {
    const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
    
    if (points.length) {
        const point = points[0];
        const dataset = chart.data.datasets[point.datasetIndex];
        const algorithm = dataset.label;
        
        if (event.shiftKey) {
            // Remove all data for this algorithm
            results[algorithm].n = [];
            results[algorithm].time = [];
        } else {
            // Remove single point
            results[algorithm].n.splice(point.index, 1);
            results[algorithm].time.splice(point.index, 1);
        }
        
        updateChart();
    }
}); 