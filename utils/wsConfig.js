const { ApiPromise, WsProvider } = require('@polkadot/api');



async function api()  {

    const provider = new WsProvider('ws://127.0.0.1:9944');

    // Create the API and wait until ready
    return await ApiPromise.create({ provider,types:{
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
}


module.exports ={
  api
} ;