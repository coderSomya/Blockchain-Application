App = {
    load : async()=>{
        // load app..
        console.log("app loading")
    }
}

$(()=>{
    $(window).load(()=>{
        App.load()
    })
})