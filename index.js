const csv = require("csv-parser");
const fs = require("fs");
const moment = require("moment");

let data = [];
fs.createReadStream("data1.csv")
  .pipe(csv())
  .on("data", (row) => {
    let { date1, sys, dia, pulse } = row;
    let dateP = new Date(date1);
    let mDate = moment(date1);
    dateP = mDate.toDate();
    let newRow = { ...row };
    newRow.date = dateP;
    data.push(newRow);
  })
  .on("end", () => {
    let sets = [];

    console.log("CSV file successfully processed");
    //console.log(data);
    let pointer = 0;
    let index = 0;
    while (pointer < data.length) {
      let set = [];
      let baseDate = data[pointer].date;
      let from = new Date(baseDate.valueOf());
      from.setHours(from.getHours() - 1);
      let to = new Date(baseDate.valueOf());
      to.setHours(to.getHours() + 1);
      while (index < data.length) {
        const currentValue = data[index].date.valueOf();
        const fromValue = from.valueOf();
        const toValue = to.valueOf();
        if (currentValue >= fromValue && currentValue <= toValue) {
          set.push(data[index]);
        } else {
          break;
        }
        index++;
      }
      sets.push(set);
      pointer = index;
    }
    console.log(sets);
  });
