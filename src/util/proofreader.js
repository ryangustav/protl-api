const { GoogleGenerativeAI } = require("@google/generative-ai")
require('dotenv').config()
const fs = require ('fs');

const token = process.env.gemini_token;
const genAI = new GoogleGenerativeAI('AIzaSyAq6bKlLLLOsZKKJML-evHWScKviXvOnJY');

async function proofreader(translation) {
    const personalityFilePath = './src/memory/proofreader/memory.txt';
    const personalityContentPromisse = new Promise((resolve, reject) => {
      fs.readFile(personalityFilePath, 'utf-8', (err, personalityContent) => {
        if (err) {
          reject(err);
        } else {
          resolve(personalityContent);
        }
      });
    });
  
    try {
      const personalityContent = await personalityContentPromisse;
    const personalityLines = personalityContent.toString().split('\n');


    const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ];

    const generationConfig = { maxOutputTokens: 10000, temperature: 0 };
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings, generationConfig });
   // console.log(model)
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            { text: `${personalityLines}\n Cumpra com sua função de revisor.` },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: `Vou avisar sobre minha funcionalidade de revisar  traduções. Também limitarei todas as minhas respostas a 9.000 caracteres ou menos, independentemente do que você disser. Sinta-se à vontade para me perguntar qualquer coisa! `,
            },
          ],
        },
      ],
      generationConfig: { maxOutputTokens: 8000, temperature: 0 },
    });

   /// console.log(countResult.totalTokens);
    const result = await chat.sendMessage(translation);

     if (result.response.promptFeedback?.blockReason === 'OTHER') return console.log('Diminua o texto da primeira ou segunda parte! E verifique se não há palavras que indiquem algum crime!')
    
    const response = await result.response;
    return response.candidates;
  } catch (err) {
    console.error('Erro ao ler o arquivo:', err);
  }
}

module.exports = proofreader