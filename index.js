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
      const parts_divisioned = {}
      const parts = [
        translation.slice(0, division),
        translation.slice(division, division * 2),
        translation.slice(division * 2, division * 3),
        translation.slice(division * 3)
      ];
      
     await parts.forEach(async (part, index) => {
       if (!parts_divisioned[index + 1]) {
        parts_divisioned[index + 1] = part.join("\n")
       } else {
        parts_divisioned[index + 1] = parts_divisioned[index + 1] + part.join("\n");
       }
      });
    let part_1, part_2, part_3, part_4;
     for (let i = 0; i < 4; i++) {
      if (i === 1) {
        part_1 = `${parts_divisioned[i]}`;
      } else if (i === 2) {
        part_2 = `${parts_divisioned[i]}`;
      } else if (i === 3) {
        part_3 = `${parts_divisioned[i]}`;
      } else if (i === 4) {
        part_4 = `${parts_divisioned[i]}`;
      }
     }
     console.log(part_1,part_2, part_3, part_4)
      



let revisaodois, revisaothree, revisaofour, proofed;
//console.log(proof);
const revisaoum = await proofreader(part_1);
setTimeout(async () => { revisaodois = await proofreader(part_2); console.log("passed")}, 8000)
setTimeout(async () => {  revisaothree = await proofreader(part_3); console.log("passed")}, 13000)
setTimeout(async () => {  revisaofour = await proofreader(part_4); console.log("passed")}, 19000)
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