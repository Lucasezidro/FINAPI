# FINAPI

### Requisitos

- Deve ser possivel criar uma conta
- Deve ser possivel buscar o extrato bancario do cliente
- Deve ser possivel realizar um deposito
- Deve ser possivel realizar um saque
- Deve ser possivel buscar o extrato bancario do cliente por data
- Deve ser possivel atualizar os dados da conta do cliente
- Deve ser possivel obter os dados da conta do cliente
- Deve ser possivel deletar uma conta
- Deve ser possivel retornar o balance

### Regras de Negócio

- Não deve ser possivel cadastrar uma conta com CPF já existente
- Não deve ser possivel fazer deposito em uma conta não existente
- Não deve ser possivel buscar extrato em uma conta não existente
- Não deve ser possivel fazer saque em uma conta não existente
- Não deve ser possivel excluir uma conta não existente
- Não deve ser possivel fazer saque quando o saldo não for suficiente
