var excelToJson = require("convert-excel-to-json");
const User = require("../models/User");

const importExcelData2MongoDB = (filePath) => {
  // -> Read Excel File to Json Data
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [
      {
        // Excel Sheet Name
        name: "User",
        // Header Row -> be skipped and will not be present at our result object.
        header: {
          rows: 1,
        },
        // Mapping columns to keys
        columnToKey: {
          A: "name",
          B: "email",
          C: "password",
        },
      },
    ],
  });
  // -> Log Excel Data to Console
  console.log(excelData);
  /**
    { 
    Customers:
    [ 
    { _id: 1, name: 'Jack Smith', address: 'Massachusetts', age: 23 },
    { _id: 2, name: 'Adam Johnson', address: 'New York', age: 27 },
    { _id: 3, name: 'Katherin Carter', address: 'Washington DC', age: 26 },
    { _id: 4, name: 'Jack London', address: 'Nevada', age: 33 },
    { _id: 5, name: 'Jason Bourne', address: 'California', age: 36 } 
    ] 
    }
    */
  // Insert Json-Object to MongoDB
  User.insertMany(excelData, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
  fs.unlinkSync(filePath);
}

module.exports = {importExcelData2MongoDB};
