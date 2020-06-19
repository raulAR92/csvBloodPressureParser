const csv = require("csv-parser");
const fs = require("fs");
const moment = require("moment");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

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
    //console.log(sets);

    let finalData = [];
    sets.forEach((s) => {
      let formatDate = moment(s[0].date);
      const element = {
        date: formatDate.format("DD/MM/YYYY HH:mm"),
        first: null,
        second: null,
        third: null,
        sistolica: null,
        diastolica: null,
        pulso: null,
      };

      let results = [];
      let sistolica = 0;
      let diastolica = 0;
      let pulso = 0;
      s.forEach((lecture) => {
        let systolic = lecture.sys;
        let diastolic = lecture.dia;
        let pulse = lecture.pulse;
        let format = `${systolic}/${diastolic} - ${pulse}`;
        sistolica += parseInt(systolic);
        diastolica += parseInt(diastolic);
        pulso += parseInt(pulse);
        results.push(format);
      });
      if (results[0]) element.first = results[0];
      if (results[1]) element.second = results[1];
      if (results[2]) element.third = results[2];
      if (results[3]) element.third = results[3];
      element.sistolica = sistolica / s.length;
      element.diastolica = diastolica / s.length;
      element.pulso = pulso / s.length;
      finalData.push(element);
    });

    //console.log(finalData);
    const csvWriter = createCsvWriter({
      path: "./final.csv",
      header: [
        { id: "date", title: "FECHA" },
        { id: "first", title: "Primera" },
        { id: "second", title: "Segunda" },
        { id: "third", title: "Tercera" },
        { id: "sistolica", title: "Tercera" },
        { id: "diastolica", title: "Tercera" },
        { id: "pulso", title: "Tercera" },
      ],
    });

    csvWriter.writeRecords(finalData).then(() => {
      console.log("creado");
    });
  });
