const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList', (accounts)=>{
  before(async ()=>{
    this.todoList = await TodoList.deployed()
  })

  it('deploys successfully', async()=>{
    const address = await this.todoList.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('lists tasks', async()=>{
    const taskcount = await this.todoList.taskCount()
    const task = await this.todoList.tasks(taskcount)
    assert.equal(task.id.toNumber(), taskcount.toNumber())
  })

  it('creates tasks', async()=>{
    const result= await this.todoList.createTask('A new task')
    const taskCount = await this.todoList.taskCount()

    assert.equal(taskCount, 2)

    const event = result.logs[0].args
    console.log(event)
  })
})