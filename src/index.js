const { request } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid')

const app = express();
app.use(express.json())

const custumers = [];

// Middleware que verifica se uma conta existe
function verifyIfExistsAccountCPF(req, res, next) {
    const { cpf } = req.headers;

    //- Deve ser possivel buscar o extrato bancario do cliente

    const custumer = custumers.find(custumer => custumer.cpf === cpf)

     // - Não deve ser possivel fazer deposito em uma conta não existente

     if(!custumer) {
        return res.status(400).json({ error: "custumer not found" })
    }

    request.custumer = custumer

    return next();

}

// determinar o valor que posso sacar
function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === 'credit') {
            return acc + operation.amount
        } else {
            return acc - operation.amount;
        }
    }, 0);

    return balance;
}

// - Deve ser possivel criar uma conta

app.post('/account', (req, res) => {
    const { cpf, name } = req.body;

    // - Não deve ser possivel cadastrar uma conta com CPF já existente

    const custumerAlreadyExists = custumers.some(
        (custumer) => custumer.cpf === cpf
    )

    if(custumerAlreadyExists) {
        return res.status(400).json({ error: "custumer already exists" })
    }

    custumers.push({
        cpf,
        name,
        id: uuidv4() ,
        statement: []
    });

    return res.status(201).send()
});

// app.use(verifyIfExistsAccountCPF)

app.get('/statement', verifyIfExistsAccountCPF, (req, res) => {
    const { custumer } = request;

    return res.json(custumer.statement)
});

// - Deve ser possivel realizar um deposito

app.post('/deposit', verifyIfExistsAccountCPF, (req, res) => {
    const { description, amount } = req.body;

    const { custumer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'credit'
    }

    custumer.statement.push(statementOperation);

    return res.status(201).send()
});

// - Deve ser possivel realizar um saque

app.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
    const { amount } = req.body;
    const { custumer } = request
    const balance = getBalance(custumer.statement)

    //- Não deve ser possivel fazer saque em uma conta não existente
    if (balance < amount) {
        return res.status(400).json({ error: "Insufficient funds" })
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: 'debit'
    }
    
    custumer.statement.push(statementOperation)

    return res.status(201).send()

});

// - Deve ser possivel buscar o extrato bancario do cliente por data

app.get('/statement/date', verifyIfExistsAccountCPF, (req, res) => {
    const { custumer } = request;
    const { date } = req.query;

    const dateFormat = new Date(date + " 00:00")

    const statement = custumer.statement
    .filter((statement) => statement.created_at
    .toDateString() === new Date(dateFormat)
    .toDateString())

    return res.json(statement)
});

// - Deve ser possivel atualizar os dados da conta do cliente

app.put('/account', verifyIfExistsAccountCPF, (req, res) => {
    const { name } = req.body;
    const { custumer } = request;
    
    custumer.name = name;
    return res.status(201).send()
})

//- Deve ser possivel obter os dados da conta do cliente

app.get("/account", verifyIfExistsAccountCPF, (req, res) => {
    const { custumer } = request;

    return res.json(custumer)
});

// - Deve ser possivel deletar uma conta

app.delete('/account', verifyIfExistsAccountCPF, (req, res) => {
    const { custumer } = request;

    custumers.splice(custumer, 1);

    return res.status(200).json(custumers)
});


// - Deve ser possivel retornar o balance

app.get('/balance', verifyIfExistsAccountCPF, (req, res) => {
    const { custumer } = request;
    const balance = getBalance(custumer.statement)

    return res.json(balance)
})

app.listen(3333)