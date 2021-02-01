const Modal = {
  open(){
    document
      .querySelector('.modal-overlay')
      .classList.add('active')
  },
  close(){
    document
      .querySelector('.modal-overlay')
      .classList.remove('active')
  },

  incomeSelect(){
    document
      .querySelector('.button.income')
      .classList.add('selected')
      document
        .querySelector('.button.expense')
        .classList.remove('selected')           
  },
  expenseSelect(){
    document
      .querySelector('.button.expense')
      .classList.add('selected')
      document
        .querySelector('.button.income')
        .classList.remove('selected')

      
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },

  set(transactions) {
    localStorage.setItem("dev.finances:transactions",
    JSON.stringify(transactions))
  }
}

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    let income = 0;
    // pegar as transações | para cada transação
    Transaction.all.forEach(transaction => {
      // se ela for maior que zero
      if( transaction.amount > 0)  {
        // somar a uma variavel e retorna-la
        income += transaction.amount;
      }
    })

    return income;
  },
  
  expenses() {
    let expense = 0;
    // pegar as transações | para cada transação
    Transaction.all.forEach(transaction => {
      // se ela for menor que zero
      if( transaction.amount < 0)  {
        // somar a uma variavel e retorna-la
        expense += transaction.amount;
      }
    })
    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expenses();
  }
}

// subtituir os dados do html com os do js
const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)

  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrecy(transaction.amount)

    const html = `
    <tr>
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
      </td>
    </tr>
    `
    return html;
  },

  updateBalance() {
    document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrecy(Transaction.incomes())
    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrecy(Transaction.expenses())
    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrecy(Transaction.total())
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ""
  }
}


const Utils = {
  formatAmount(value) {
    const splitedValue = value.split(".")
    if ( splitedValue.length > 1) {
      
      if (splitedValue[1].length == 1) {
        value = Number(value.replace(/[.]/g, "")) * 10
      }
      else {
        value = Number(value.replace(/[.]/g, ""))
      }    
    }
    else {
      value = Number(value) * 100
    }
    return value;  
  },
  formatDate(date) {
    const splittedDate = date.split("-") 
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrecy(value) {
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")  

    value = Number(value) / 100

    value= value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    return signal + value;
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    let option = document.querySelector('input[name="option"]:checked').value;
    if (option == 1) {
      amount = "-" + Form.amount.value
    }
    else {
      amount = Form.amount.value
    }
    return {
      description: Form.description.value,
      amount,
      date: Form.date.value,   
    }
  },
  

  validateField() {
    const {description, amount, date} = Form.getValues()
    if( description.trim() === "" || 
        amount.trim() === "" || 
        date.trim() === "") {
          throw new Error("Por favor, preencha todos os campos!");
        }
  },

  formatValues() {
    let {description, amount, date} = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event) {
    event.preventDefault()

    try {
      Form.validateField()
      const transaction = Form.formatValues()
      Transaction.add(transaction)
      Form.clearFields()
      Modal.close()
    } catch (error) {
      alert(error.message)
    }
    
  }
}

const App = {
  init() {

    Transaction.all.forEach(DOM.addTransaction)
    
    DOM.updateBalance()
     
    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()


/*[
  {
    description: 'Luz',
    amount: -50000,
    date: '15/01/2021'
  },
  {
    description: 'Criação de website',
    amount: 500000,
    date: '15/01/2021'
  },
  {
    description: 'Internet',
    amount: -20000,
    date: '15/01/2021'
  },
  {
    description: 'App',
    amount: 200000,
    date: '15/01/2021'
  },
],*/