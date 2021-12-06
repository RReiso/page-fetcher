const request = require('request');
const fs = require('fs');
const readline = require('readline');


const fetcher = (args) =>{
  if (args.length > 2) {
    return console.log("Invalid arguments: specify only URL and local file path!");
  } else if (args.length < 2) {
    return console.log("Missing arguments: specify URL and local file path!");
  }

  //make a request
  const [URI, filePath] = args;
  request(URI, (error, response) => {
    if (!error) {
      // check if file already exists
      doesFileExist(response.body, filePath);
    } else {
      console.log('There was an error:', error.message);
    }
  });
};


// prompt user to overwrite the file
const doesFileExist = (data, filePath) => {

  // open reading stdin stream
  if (fs.existsSync(filePath)) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(("The file already exists. Overwrite? y/n "), (answer) => {
      rl.close(); // close stream

      if (answer === "y") {
        saveToFile(data, filePath);
        console.log(`${filePath} has been overwritten.`);
      }
    });
  } else {
    saveToFile(data, filePath);
  }
};


// write data to the file
const saveToFile = (data, filePath) =>{
  fs.writeFile(filePath, data, err => {
    if (err) {
      console.log("There was an error while trying to write to the file:\n", err.message);
      return;
    }
    console.log(`Downloaded and saved ${Buffer.byteLength(data, 'utf8')} bytes to ${filePath}.`);
  });
};

// fetch command line arguments
const args = process.argv;
fetcher(args.slice(2));
