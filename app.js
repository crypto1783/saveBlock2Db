const { ApiPromise, WsProvider } = require('@polkadot/api');
var mysql      = require('mysql');
const {saveEvents} =  require('./db/models/event');
const {saveBlock, findBlock} =  require('./db/models/block');
const schedule = require('node-schedule');




startJob();
async function startJob(){
    const provider = new WsProvider('ws://127.0.0.1:9944');
    const api = await ApiPromise.create({ provider,types:{
        "ClassId": "u64",
        "ClassIdOf": "ClassId",
        "TokenId": "u64",
        "TokenIdOf": "TokenId",
        "ItemType": {
          "_enum": [
            "physical",
            "virtual"
          ]
        },
        "ItemClassData": {
          "item_type": "ItemType",
          "info": "Vec<u8>"
        },
        "ItemTokenData": {
          "info": "Vec<u8>"
        },
        "TokenData": "ItemTokenData",
        "MaxClassMetadata": 1024,
        "MaxTokenMetadata": 1024,
        "ClassDataOf": "ItemClassData",
        "TokenDataOf": "ItemTokenData",
        "PeerId": "(Vec<u8>)",
        "ClassInfoOf": {
          "metadata": "BoundedVec<u8, MaxClassMetadata>",
          "total_issuance": "TokenId",
          "owner": "AccountId",
          "data": "ItemClassData"
        },
        "TokenInfoOf": {
          "metadata": "BoundedVec<u64, MaxTokenMetadata>",
          "owner": "AccountId",
          "data": "ItemTokenData"
        },
        "Contract": {
          "contract_code": "Vec<u8>",
          "package_code": "Vec<u8>",
          "warrant_list": "Vec<Vec<u8>>",
          "status": "Vec<u8>",
          "user": "Vec<u8>"
        },
        "ContractDataOf": {
          "contract_code": "Vec<u8>",
          "package_code": "Vec<u8>",
          "warrant_list": "Vec<Vec<u8>>",
          "status": "Vec<u8>",
          "create_block_num": "u32",
          "creater": "AccountId",
          "modify_user": "AccountId",
          "modify_block_num": "u32",
          "user": "Vec<u8>"
        }
      }});
    // 定义规则
    let rule = new schedule.RecurrenceRule();
    rule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]; 
    let job = schedule.scheduleJob(rule, () => {
        console.log(new Date());
        save2MySql(api);
    });
}

async function save2MySql(api){

    let currentBlock = await api.rpc.chain.getBlock();
    
    let blockHash = currentBlock.block.header.hash.toHuman();  

    while (1)
    {

        const signedBlock = await api.rpc.chain.getBlock(blockHash);
       
        let header = await api.derive.chain.getHeader(blockHash);
        //const blockNum = header?.number.unwrap().toHuman();
        const blockNum = header?.number.unwrap().toString();
        fBlcok = await findBlock(blockHash);
        console.log("当前块====》",blockNum);
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




