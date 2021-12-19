const sq  = require('../sequelize');
const Sequelize = require('sequelize');
//const {api} = require('../../utils/wsConfig.js');
const {createTicketEvent} =  require('./ticket_event');


var Event = sq.define(
    'event',
    {
        id: {
            type: Sequelize.BIGINT(32),
            primaryKey: true,
            autoIncrement: true
        },
        section: Sequelize.STRING(32),
        method: Sequelize.STRING(32),
        extrinsic: Sequelize.STRING(255),
        index: Sequelize.STRING(32),
        block_hash: Sequelize.STRING(256),
        block_num: Sequelize.BIGINT(256)       
    }, 
    {
        timestamps: false
    },
    {
        tableName: 't_event'
    });

var ticket_event = sq.define(
    'ticket_event',
    {
        id: {
            type: Sequelize.BIGINT(32),
            primaryKey: true,
            autoIncrement: true
        },
        ticket_num: Sequelize.INTEGER(32),
        hash: Sequelize.STRING(32),
        method: Sequelize.STRING(32),
        extrinsic: Sequelize.STRING(32),
        index: Sequelize.INTEGER(32),
        block_hash: Sequelize.STRING(32),
        block_num: Sequelize.INTEGER(128)
    },
    {
        timestamps: false
    },
    {
        tableName: ticket_event
    }
);

var EventParam = sq.define(
    'event_param',
    {
        id: {
            type: Sequelize.BIGINT(32),
            primaryKey: true,
            autoIncrement: true    
        },
        index: Sequelize.BIGINT(10),
        event_id: Sequelize.STRING(32),
        type: Sequelize.STRING(32),
        value: Sequelize.STRING(255)
    },
    {
        timestamps: false
    },
    {
        tableName: 'event_param'
    }
);


async function createEvent (eventData, params)
{
    Event.create(eventData).then(function (p)
    {
        eventId = p.id;
        //console.log('event created.' + JSON.stringify(p));
        createEventParams(eventId, params);
    }).catch(function (err) {
        console.log('failed info: ' + err);
    });
}

function createEventParams (eventId, params)
{
    params.map(function(element){
        element.event_id = eventId;
        return element;
    });
    EventParam.bulkCreate(params).then(function (p)
    {
        //console.log('param created.' + JSON.stringify(p));
    }).catch(function (err) {
        console.log('EventParam. bulkCreate failed: ' + err);
    });
}

let handler = {
    TokenMinted(event) {
        var key  = ['account', 'sourceId', 'metadata', 'info']
        return encapsulates(event, key);
    },

    TokenTransferred: function (event) {
        var key  = ['account', 'toAccount', 'sourceId']
        return encapsulates(event, key);
    },

}

function encapsulates(event, key){
    var obj = {};
    var list = event.data.toHuman();
    list.map((item,idx) => {
        obj[key[idx]] = item;
    })
    return obj;
}

async function saveEvents(hash, blockNum,api) {
    const eventsInOneBlock = await api.query.system.events.at(hash);
    const events = eventsInOneBlock
        .filter(({ phase }) => phase.isApplyExtrinsic //&&
            //phase.asApplyExtrinsic.eq(index)

        )
        // .filter(({ event }) => event.section == 'kittiesModule'
        // )
        .map(({ event, phase }) => ({
            data: event.data,
            section: event.section,
            method: event.method,
            typeDef: event.typeDef,
            index: phase.asApplyExtrinsic
        }));
    events.forEach(
        function (event) {
            console.log("event---",event);
            console.log("data---",event.data.toHuman());
            // let dataArray = event.data.map((value) => ({ value }));
            // var list = event.data.toHuman();
            // list.map((item,index) => {
               
            // })
            // console.log("参数结果",dataArray);
            // dataArray.forEach(
            //     function (element, index) {
            //         console.log("参数结果",element);
            //         const paramtype = event.typeDef[index].type;
            //         const paramValue = element.value.toHuman();
            //         //console.log("Param Type = ", paramtype, ". Param Value = ", paramValue);
            //         //console.log("asApplyExtrinsic=", event.index);
            //         paramData = {
            //             id: null,
            //             index: index,
            //             event_id: null,
            //             type: paramtype,
            //             value: paramValue
            //         };
            //         paramArr.push(paramData);
            //         console.log("paramArr====>",paramArr);
            //     }
             
            // );

            if (event.section == 'gwiTicket')
            {
                console.log("请求方法", event.method);
                var obj = handler[event.method] && handler[event.method](event);
                if(obj){
                    var sourceId = obj.sourceId || ['-0', '0'];
                    const eventData = {
                        id: null,
                        section: event.section,
                        method: event.method,
                        extrinsic: '',
                        index: '',
                        block_hash: hash,
                        block_num: parseInt(blockNum),
                        class_id: parseInt(sourceId[0]),
                        token_id: parseInt(sourceId[1]),
                        info: JSON.stringify(obj),
                    };
                    console.log("obj请求",eventData)
                    createTicketEvent(eventData)
                }
                // console.log("Dara====",event.data)
                // console.log("created===>",dataArray[1].value.toHuman());
                // console.log("info===>",dataArray[0].value.toHuman());
                // if (event.method == 'Created')
                // {
                //     const ticketEvent = {
                //         id: null,
                //         ticket_index: dataArray[1].value.toHuman(),
                //         ticket_hash: null,
                //         method: event.method,
                //         section: event.section,
                //         extrinsic_hash: null,
                //         block_hash: hash,
                //         block_num: blockNum,
                //         info: 'create by: account: ' + dataArray[0].value.toHuman() +'. ticket index: ' + dataArray[1].value.toHuman()
                //     };
                //     console.log("created===>",dataArray[1].value.toHuman());
                //     console.log("info===>",dataArray[0].value.toHuman());
                //     // createTicketEvent(ticketEvent)
                // }
                //Transferred(AccountId, AccountId,KittyIndex),
                // if (event.method == 'Transferred')
                // {
                //     const ticketEvent = {
                //         id: null,
                //         ticket_index: dataArray[2].value.toHuman(),
                //         ticket_hash: null,
                //         method: event.method,
                //         section: event.section,
                //         extrinsic_hash: null,
                //         block_hash: hash,
                //         block_num: blockNum,
                //         info: 'transfer .from account: '+dataArray[0].value.toHuman() +' to account: ' + dataArray[1].value.toHuman()
                //     };
                //     console.log("Transferred===>",dataArray[2].value.toHuman());
                //     // createTicketEvent(ticketEvent)
                // }
                // //SplitToTwo(AccountId, KittyIndex, KittyIndex, KittyIndex),
                // if (event.method == 'SplitToTwo')
                // {
                //     const ticketEvent = {
                //         id: null,
                //         ticket_index: dataArray[1].value.toHuman(),
                //         ticket_hash: null,
                //         method: event.method,
                //         section: event.section,
                //         extrinsic_hash: null,
                //         block_hash: hash,
                //         block_num: blockNum,
                //         info: 'split to two ticket. ticket NO.1: '+dataArray[2].value.toHuman() +'. ticket NO.2: ' + dataArray[3].value.toHuman()
                //     };
                //     console.log("SplitToTwo===>",dataArray[1].value.toHuman());
                //     // createTicketEvent(ticketEvent)
                // }
            }
            //createEvent(eventData, paramArr);
        }
    );
}
module.exports ={
    createEvent,
    createEventParams,
    saveEvents 
} ;