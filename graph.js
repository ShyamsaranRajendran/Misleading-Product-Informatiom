const express = require('express');
const { Chart, LinearScale, CategoryScale, TimeScale, LogarithmicScale, BarController, BarElement } = require('chart.js');
const { Canvas } = require('canvas');
const fs = require('fs');

// Explicitly register scales and controllers
Chart.register(LinearScale, CategoryScale, TimeScale, LogarithmicScale, BarController, BarElement);

async function createAndSaveChart() {
  // Create a virtual canvas
  const canvas = new Canvas(800, 600);
  const ctx = canvas.getContext('2d');

  // Create a chart instance with the virtual canvas
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Product vice', 'Information vice', 'Bla Bla... ', 'Based on Reviews',""],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 70, 5,100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 255, 0, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(242, 242, 242, 1)'

         
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 255, 0, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(242, 242, 242, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Save the chart as an image
  const imageBuffer = canvas.toBuffer('image/png');
  
  try {
    await fs.promises.writeFile('public/chart.png', imageBuffer);
    console.log('Chart saved successfully as chart.png');
  } catch (error) {
    console.error('Error saving chart:', error);
  }
}

// Call the function to create and save the chart
createAndSaveChart();

// Create an express app
const app = express();
const port = 4000;
// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/chart.png');
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
