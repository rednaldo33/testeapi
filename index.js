const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());  // Para que a aplicação possa aceitar JSON no corpo da requisição

// URL da API da RisePay
const RISEPAY_API_URL = "https://api.risepay.com.br/api/External/Transactions"; 
const API_KEY = "7d4e01cb14a0530b10831bdb6688728e0c1f50b55486dff10aeb9f47aa1ce549";  // Novo token

// Endpoint para gerar pagamento via Pix
app.post('/gerar-pagamento', async (req, res) => {
    const { valor, nome, cpf, email, telefone } = req.body; // Recebe os dados do frontend

    const data = {
        amount: valor * 100,  // Converte o valor para centavos
        payment: { method: "pix" }, // Método de pagamento
        customer: {
            name: nome,
            email: email,
            cpf: cpf,
            phone: telefone
        }
    };

    try {
        // Faz a requisição POST para a API da RisePay
        const response = await axios.post(RISEPAY_API_URL, data, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`, // Envia o token no header
                "Content-Type": "application/json"
            }
        });

        // Extrai o QR Code e o link do pagamento da resposta da API
        const { qrCode, paymentLink } = response.data.object.pix;

        // Retorna o QR Code e o link Pix para o frontend
        res.json({ qr_code: qrCode, link_pix: paymentLink });

    } catch (error) {
        console.error("Erro ao gerar o pagamento:", error);
        res.status(500).json({ error: "Erro ao gerar o pagamento" });
    }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
