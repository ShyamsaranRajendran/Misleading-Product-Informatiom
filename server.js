const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const { Chart, LinearScale, CategoryScale, TimeScale, LogarithmicScale, BarController, BarElement } = require('chart.js');
const { Canvas } = require('canvas');

Chart.register(LinearScale, CategoryScale, TimeScale, LogarithmicScale, BarController, BarElement);
//// ---------------------------------------------- Make a Json compare -------------------------------------------------------- ////
function generateChartData() {
 

  

    return [12.23, 31.89, 40.9, 59.8, 100];
  }
//// ---------------------------------------------- Make a Json compare -------------------------------------------------------- ////

async function createAndSaveChart() {
  const canvas = new Canvas(800, 600);
  const ctx = canvas.getContext('2d');

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Product vice', 'Information vice', 'Bla Bla... ', 'Based on Reviews',""],
      datasets: [{
        label: '# of Votes',
        data: generateChartData(),
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

  const imageBuffer = canvas.toBuffer('image/png');

  try {
    await fs.writeFile('public/chart.png', imageBuffer);
    console.log('Chart saved successfully as chart.png');
  } catch (error) {
    console.error('Error saving chart:', error);
  }
}

createAndSaveChart();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'Product', 'products.json');
    const isDirectory = await fs.stat(filePath).then(stat => stat.isDirectory());

    if (isDirectory) {
      throw new Error(`Invalid file path: ${filePath} is a directory.`);
    }

    const jsonData = await fs.readFile(filePath, 'utf8');
    const products = JSON.parse(jsonData);

    if (!Array.isArray(products)) {
      throw new Error('Invalid data format: Products is not an array.');
    }

    const htmlContent = generateHTML(products);

    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.status(500).send('Internal Server Error');
  }
});

function generateHTML(products) {
  const productColumns = products.map((product, index) => {
    const productFields = generateFieldsHTML(product);

    return `
      <div class="column s${index + 1}">
        <h2>${product["Product Name"]}</h2>
        ${productFields}
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="/sty.css">
      <title> Product Content</title>
    </head>
    <body>
      <h1>Amelia & Isabella</h1>
      <br>
      <br>
      <div class="container">
        <div class="column" id="pos">
        <h3>Product Data</h3>
          ${productColumns}
        </div>
        <div class="column">
        <h3>Web Data</h3>
          ${productColumns}
        </div>
        <div class="column">
        <h3>Misleaded Data</h3>
        <br>
        <br>
          <div class="iop">
            <img src="chart.png" alt="no images">
          </div>
          <br>
          <br>
          <div id="download">
            <button type="button" onclick="generatePDF()">Download PDF</button>
          </div>
        </div>
      </div>
      <script src="/index.js"></script>
    </body>
    </html>
  `;
}

function generateFieldsHTML(data) {
  return Object.entries(data).map(([key, value]) => {
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        const arrayItems = value.map((item, index) => {
          return `<p><strong>${key} ${index + 1}:</strong> ${generateFieldsHTML(item)}</p>`;
        }).join('');
        return arrayItems;
      } else {
        return `<div>${generateFieldsHTML(value)}</div>`;
      }
    } else {
      return `<p><strong>${key}:</strong> ${value}</p>`;
    }
  }).join('');
}










app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
