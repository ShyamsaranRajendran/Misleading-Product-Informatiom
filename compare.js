const fs = require('fs');
const jsondiffpatch = require('jsondiffpatch');

const deepEqual = require('deep-equal'); // Install deep-equal module

function readJSONFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }
  
function calculatePercentageDifference(obj1, obj2) {
  let differingKeys = 0;
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  allKeys.forEach(key => {
    if (key in obj1 && key in obj2) {
      if (!deepEqual(obj1[key], obj2[key])) {
        console.log(obj1[key] + " is equal " );
        differingKeys=differingKeys+1;
      }
    } else {
        console.log(key + " is not equal " );
      differingKeys=differingKeys+1;
    }
  });

  return (differingKeys / allKeys.size) * 100;
}


  const jsonArray1 = readJSONFile("Product/products.json");
  const jsonArray2 = readJSONFile("original.json");
  
  
  const percentageDifference = calculatePercentageDifference(jsonArray1[0], jsonArray2[0]);
  console.log(`Percentage Difference: ${percentageDifference} %`);
