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
            var paramArr = new Array();
            let dataArray = event.data.map((value) => ({ value }));
            dataArray.forEach(
                function (element, index) {
                    const paramtype = event.typeDef[index].type;
                    const paramValue = element.value.toHuman();
                    //console.log("Param Type = ", paramtype, ". Param Value = ", paramValue);
                    //console.log("asApplyExtrinsic=", event.index);
                    paramData = {
                        id: null,
                        index: index,
                        event_id: null,
                        type: paramtype,
                        value: paramValue
                    };
                    paramArr.push(paramData);
                }
            );

            if (event.section == 'kittiesModule')
            {
                if (event.method == 'Created')
                {
                    const ticketEvent = {
                        id: null,
                        ticket_index: dataArray[1].value.toHuman(),
                        ticket_hash: null,
                        method: event.method,
                        section: event.section,
                        extrinsic_hash: null,
                        block_hash: hash,
                        block_num: blockNum,
                        info: 'create by: account: ' + dataArray[0].value.toHuman() +'. ticket index: ' + dataArray[1].value.toHuman()
                    };
                    createTicketEvent(ticketEvent)
                }
                //Transferred(AccountId, AccountId,KittyIndex),
                if (event.method == 'Transferred')
                {
                    const ticketEvent = {
                        id: null,
                        ticket_index: dataArray[2].value.toHuman(),
                        ticket_hash: null,
                        method: event.method,
                        section: event.section,
                        extrinsic_hash: null,
                        block_hash: hash,
                        block_num: blockNum,
                        info: 'transfer .from account: '+dataArray[0].value.toHuman() +' to account: ' + dataArray[1].value.toHuman()
                    };
                    createTicketEvent(ticketEvent)
                }
                //SplitToTwo(AccountId, KittyIndex, KittyIndex, KittyIndex),
                if (event.method == 'SplitToTwo')
                {
                    const ticketEvent = {
                        id: null,
                        ticket_index: dataArray[1].value.toHuman(),
                        ticket_hash: null,
                        method: event.method,
                        section: event.section,
                        extrinsic_hash: null,
                        block_hash: hash,
                        block_num: blockNum,
                        info: 'split to two ticket. ticket NO.1: '+dataArray[2].value.toHuman() +'. ticket NO.2: ' + dataArray[3].value.toHuman()
                    };
                    createTicketEvent(ticketEvent)
                }
            }

            const eventData = {
                id: null,
                section: event.section,
                method: event.method,
                extrinsic: '',
                index: '',
                block_hash: hash,
                block_num: blockNum
            };
            //console.log("eventData = ", eventData);
            createEvent(eventData, paramArr);
        }
    );
}
module.exports ={
    createEvent,
    createEventParams,
    saveEvents 
} ;