const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const token = process.env.RISE_PAY_API_KEY;
const API_URL = "https://api.risepay.com.br/api/External/Transactions";

app.post("/gerar-pix", async (req, res) => {
  const { amount, name, email, cpf, phone, splits } = req.body;

  const payload = {
    amount: parseFloat(amount),
    payment: { method: "pix" },
    customer: {
      name: name || "Cliente Teste",
      email: email || "teste@exemplo.com",
      cpf: cpf || "12345678900",
      phone: phone || "(00) 00000-0000"
    }
  };

  if (Array.isArray(splits) && splits.length > 0) {
    payload.SplitTransactions = splits;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar cobrança." });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
