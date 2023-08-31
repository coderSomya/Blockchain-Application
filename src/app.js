App = {
    load : async()=>{
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
      await App.renderTasks()
    },

    loading: false,

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
    },

    loadContract: async () => {
        try {
            const todoList = await $.getJSON('TodoList.json');
            if (!App.contracts) {
                App.contracts = {};
            }
            App.contracts.TodoList = TruffleContract(todoList);
            App.contracts.TodoList.setProvider(App.web3Provider);
    
    
        } catch (error) {
            console.error('Error loading contract:', error);
        }

        App.todoList = await App.contracts.TodoList.deployed();
    },

    render: async()=>{
        if(App.loading){
            return
        }
        App.setLoading(true)
        $('#account').html(App.account)
        App.setLoading(false)
    },
    createTask: async()=>{
      App.setLoading(true)
      const content= $('#newTask').val()
      await App.todoList.createTask(content, {from: App.account})
      window.location.reload();
    },
    setLoading: (boolean)=>{
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if(boolean){
            loader.show()
            content.hide()
        }
        else{
            loader.hide()
            content.show()
        }
    },

    renderTasks: async()=>{
        const taskCount = await App.todoList.taskCount()

        const $taskTemplate = $('.taskTemplate')
      console.log(taskCount)
        for(let i=1;i<=taskCount; i++){
            const task = await App.todoList.tasks(i)
            console.log(task)
            const taskid = task[0].toNumber()
            const taskcontent = task[1]
            const taskcompleted = task[2]
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskcontent)
            $newTaskTemplate.find('input')
                            .prop('name', taskid)
                            .prop('checked', taskcompleted)
                            // .on('click', App.toggleCompleted)


            if(taskcompleted){
                $('#completedTaskList').append($newTaskTemplate)
            }
            else{
                $('#taskList').append($newTaskTemplate)
            }

            $newTaskTemplate.show()
        }
    }
    
}

$(()=>{
    $(window).load(()=>{
        App.load()
    })
})