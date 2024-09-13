const express = require("express")
const colors = require("colors")
const proofreader = require("./src/util/proofreader")
const fs = require("fs")
const iconv = require('iconv-lite');
const app = express()
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ status: 404, message: "Invalid request....."})
})

app.post("/proofreader", async function(req, res) {
  console.log("teste")
    //console.log(req.body.translation)
    const translationPromise = req.body.translation.toString().replace(/\n/g, '\n\t').replace(/\\n/g, '\n').replace(/^[\s,"']+|['",\s]+$/g, '');

console.log(translationPromise.toString());

const translation = translationPromise.split('\n');
const division = Math.ceil(translation.length / 4);

const parts = [];
for (let i = 0; i < translation.length; i += division) {
  parts.push(translation.slice(i, i + division).join('\n'));
}

let title;

const proofPromises = parts.map(part => {
  return new Promise((resolve, reject) => {
    const processedPart = part.split('\n'); // Simulate processing the part
    title = processedPart; // Assuming title is the first line
    resolve(processedPart);
  });
});

Promise.all(proofPromises)
  .then(async proofs => {
    const revisaoum = await proofreader(proofs[0]);
    const revisaodois = await proofreader(proofs[1]);
    const revisaothree = await proofreader(proofs[2]);
    const revisaofour = await proofreader(proofs[3]);

    const proofed = revisaoum[0].content.parts[0].text + revisaodois[0].content.parts[0].text + revisaothree[0].content.parts[0].text + revisaofour[0].content.parts[0].text;

    res.status(201);
    console.log(JSON.stringify(proofed));
    res.send({ "status": 201, "revisao": JSON.stringify(proofed) });
    console.log("passed");
  })
  .catch(err => {
    console.error(err);
    res.status(500).send({ error: err.message });
  });
//console.log(proofed, revisaoum.candidates)

  
      
})

app.listen(8080, app => {
//console.clear()
console.log("Servidor iniciado")
})