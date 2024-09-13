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
    const translationPromise = req.body.translation.toString().replace(/\n/g, '\n\t').replace(/\\n/g, '\n').replace(/^[\s,"']+|['",\s]+$/g, '')

      console.log(translationPromise.toString())
      const translationAwaitPromise = await translationPromise;
      const translation = translationAwaitPromise.split('\n');
      const division = Math.ceil(translation.length / 4);
      
      const parts = [
        translation.slice(0, division),
        translation.slice(division, division * 2),
        translation.slice(division * 2, division * 3),
        translation.slice(division * 3)
      ];
      
     await parts.forEach(async (part, index) => {
        fs.writeFile(`./translation/parte ${index + 1}.txt`, part.join('\n'), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log("[!] ".green + `Parte ${index + 1} saved successfully.`);

            }
        });
      });

      let title;

      const proofOnePromise = new Promise((resolve, reject) => {
  
  
  
          fs.readFile('./translation/parte 1.txt', 'utf-8', (err, proof) => {
            if (err) {
              reject(err);
            } else {
              title = proof.split('\n');
              resolve(proof);
            }
          });
        });
  
        
        const proofTwoPromise = new Promise((resolve, reject) => {
          fs.readFile('./translation/parte 2.txt', 'utf-8', (err, proof) => {
            if (err) {
              reject(err);
            } else {
              resolve(proof);
            }
          });
        });
        const proofThreePromise = new Promise((resolve, reject) => {
          fs.readFile('./translation/parte 3.txt', 'utf-8', (err, proof) => {
            if (err) {
              reject(err);
            } else {
              resolve(proof);
            }
          });
        });
      
        const proofFourPromise = new Promise((resolve, reject) => {
          fs.readFile('./translation/parte 4.txt', 'utf-8', (err, proof) => {
            if (err) {
              reject(err);
            } else {
              resolve(proof);
            }
          });
        });



const proofone = await proofOnePromise;
const prooftwo = await proofTwoPromise;
const proofthree = await proofThreePromise;
const prooffour = await proofFourPromise;
let revisaodois, revisaothree, revisaofour, proofed;
//console.log(proof);
const revisaoum = await proofreader(proofone);
setTimeout(async () => { revisaodois = await proofreader(prooftwo); console.log("passed")}, 8000)
setTimeout(async () => {  revisaothree = await proofreader(proofthree); console.log("passed")}, 13000)
setTimeout(async () => {  revisaofour = await proofreader(prooffour); console.log("passed")}, 19000)
setTimeout(async () => { 

proofed = revisaoum[0].content.parts[0].text + revisaodois[0].content.parts[0].text + revisaothree[0].content.parts[0].text + revisaofour[0].content.parts[0].text; 
res.status(201)
console.log(JSON.stringify(proofed))
res.send({ "status": 201, "revisao": JSON.stringify(proofed) })
console.log("passed")
}, 26000)
//console.log(proofed, revisaoum.candidates)

  
      
})

app.listen(8080, app => {
//console.clear()
console.log("Servidor iniciado")
})