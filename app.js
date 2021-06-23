const { ApiPromise, WsProvider } = require('@polkadot/api');
var mysql      = require('mysql');
const {saveEvents} =  require('./db/models/event');
const {saveBlock, findBlock} =  require('./db/models/block');
const schedule = require('node-schedule');




startJob();
async function startJob(){
    const provider = new WsProvider('ws://127.0.0.1:9944');
    const api = await ApiPromise.create({ provider,types:{
                                                  "Address": "AccountId",
                                                  "LookupSource": "AccountId",
                                                  "Kitty": "([u8; 16])",
                                                  "KittyIndex": "u32",
                                                  "KittyLinkedItem": {
                                                    "prev": "Option<u32>",
                                                    "next": "Option<u32>"
                                                  },
                                                  "KittyAmount": "u32"
                                                  } });
    // 定义规则
    let rule = new schedule.RecurrenceRule();
    rule.second = [0, 10, 20, 30, 40, 50]; 
    let job = schedule.scheduleJob(rule, () => {
        console.log(new Date());
        save2MySql(api);
    });
}

async function save2MySql(api){

    let currentBlock = await api.rpc.chain.getBlock();
    
    let blockHash = currentBlock.block.header.hash.toHuman();  

    console.log("start");                                              
    while (1)
    {

        const signedBlock = await api.rpc.chain.getBlock(blockHash);

        let header = await api.derive.chain.getHeader(blockHash);
        //const blockNum = header?.number.unwrap().toHuman();
        const blockNum = header?.number.unwrap().toString();
        fBlcok = await findBlock(blockHash);
        const size = fBlcok.length;
        if (size > 0)
        {
            console.log("block is exist. block num = ", blockNum);
            return;
        }
        if (blockNum == 0)
        {
            console.log("End: block 0 insert");
            return;
        }
        saveBlock(signedBlock, blockNum);
        saveEvents(blockHash, blockNum, api);
        blockHash = signedBlock.block.header.parentHash.toHuman();

    }
    


}




