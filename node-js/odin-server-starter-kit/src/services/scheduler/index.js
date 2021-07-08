import Numbers from '../../api/numbers/model'
const contract = require("../../../../../build/contracts/NumbersNFT.json")
const Web3 = require('web3')

// usando websocket posso leggere in realTime!!!
const web3 = new Web3(new Web3.providers.WebsocketProvider('http://127.0.0.1:7545'));

//contratto + codice contratto (lo restituisce truffle con il deploy sulla blockchain locale)
const contractInstance = new web3.eth.Contract(contract.abi, "0xF104FEA1Da2c0da63bfD1df09AD663A777E88237")

contractInstance.events.MintEvent({}).on('data',event => {
  Numbers.create({number: event.returnValues._value})
  console.log(event.returnValues._value)
})
const log = logger.child({ section: "\x1B[0;35mScheduler:\x1B[0m" })

export const start = function () {
  sampleFn()
}

async function sampleFn(fireDate) {
    const events = await contractInstance.getPastEvents("allEvents", { fromBlock: 0 })
    //console.log(events)
    
    log.info("Current server time: " + fireDate)
}