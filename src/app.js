App = {
    load : async()=>{
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }

         // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
          console.log(error)
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },

    loadAccount: async()=>{
        let accounts = await web3.eth.getAccounts()
        App.account = accounts[0]
        console.log(App.account)
    },

    loadContract: async () => {
        try {
            const todoList = await $.getJSON('TodoList.json');
            if (!App.contracts) {
                App.contracts = {};
            }
            App.contracts.TodoList = TruffleContract(todoList);
            App.contracts.TodoList.setProvider(App.web3Provider);
    
            console.log(todoList);
    
        } catch (error) {
            console.error('Error loading contract:', error);
        }

        App.todoList = await App.contracts.TodoList.deployed();
    },

    render: async()=>{
        $('#account').html(App.account)
    }
    
}

$(()=>{
    $(window).load(()=>{
        App.load()
    })
})