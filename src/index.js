import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';

operation()

function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
            choices: [
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
    }]).then((answer) => {
        const action = answer['action']

        if( action === 'Criar Conta') {
            createAccount()
        } else if (action === 'Depositar') {
            deposito()
        } else if (action === 'Consultar Saldo') {
            getAccountBalance()
        } else if (action === 'Sacar') {
            witdraw()
        } else if (action === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o Gringotts Wizarding Bank!'))
            process.exit()
        }

    })
    .catch((err) => console.log('Erro na Function operation:',err))
}

// criar uma conta VVV

function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildAccont()
}

// buildar a conta agora VVVV

function buildAccont() {

    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para a sua conta: '
    }]).then(answer => {
        const accountName = answer['accountName']

        console.info(accountName)

        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(
                chalk.bgRed.black('Esta conta já existe, escolha outro nome!')
            )
            buildAccont()
            return
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`, 
            '{"balance": 0}', 
            function (err) {console.log('Erro na criação do json accountName: ',err)})
        
        console.log(chalk.green('Parabéns, a sua conta foi criada!'))
        operation()

    }).catch(err => console.log('Erro na function buildAccount:', err))

}

 // função para add dinheiro na conta!!

function deposito () {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        
        const accountName = answer['accountName']

        // tenho que verificar se a conta existe!

        if(!checkACcount(accountName)) {
            return deposito()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?',
            },
        ]).then((answer) => {

            const amount = answer['amount']

            //função para add dinheiro vvv
            addAmount(accountName, amount)

            operation()

        }).catch(err => console.log('Erro na hora de depositar:', err))
    })
    .catch(err => console.log('erro na function deposito:', err))
}

function checkACcount(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, tente novamente!'))
        return false
    }

    return true 
}

function addAmount (accountName, amount) {

    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposito()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync( 
        `accounts/${accountName}.json`,
        JSON.stringify(accountData), 
        function (err) {
            console.log('erro no salvar o dado no banco:', err)
        }
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))

}

// function para ler a conta e retornar em JSON VVVV

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

//verification de saldo na account

function getAccountBalance () {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        }
    ]).then((answer) => {

        const accountName = answer["accountName"]

        // verifica account exist

        if(!checkACcount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(`Olá o saldo da sua conta é de R$${accountData.balance}`))

        operation()

    }).catch(err => console.log('Erro na função getAccountBalance:', err))

}

// sacar dinheiro

function witdraw () {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkACcount(accountName)) {
            return witdraw
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            }
        ]).then((answer) => {

            const amount = answer['amount']

            removeAmount(accountName, amount)

        }).catch(err => console.log('erro na hora do saque:', err))

    }).catch(err => console.log('Erro na função witdraw: ', err))

}

// funtion de remover dinheiro

function removeAmount (accountName, amount) {

    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return witdraw()
    }

    if(accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor indisponível!'))
        return witdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`, 
        JSON.stringify(accountData),
        function (err) {
            console.log(err => console.log('Erro na hora de saque fs.Json:', err))
        },
    )

    console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`))

    operation()

}