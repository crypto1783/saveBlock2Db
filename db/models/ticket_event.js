const sq  = require('../sequelize');
const Sequelize = require('sequelize');
var TicketEvent = sq.define(
    'events',
    {
        id: {
            type: Sequelize.BIGINT(32),
            primaryKey: true,
            autoIncrement: true
        },
        method: Sequelize.STRING(128),
        section: Sequelize.STRING(128),
        ticket_index: Sequelize.STRING(128),
        ticket_hash: Sequelize.STRING(64),
        extrinsic_hash: Sequelize.STRING(128),
        block_hash: Sequelize.STRING(128),
        block_num: Sequelize.INTEGER(11),
        class_id: Sequelize.INTEGER(11),
        token_id: Sequelize.INTEGER(11),
        info:  Sequelize.JSON(512)  
    }, 
    {
        timestamps: false
    },
    {
        tableName: 'events'
    }
);

async function createTicketEvent (ticketData)
{
    console.log("create ticket event", ticketData);
    TicketEvent.create(ticketData).then(function (p)
    {
       console.log('ticket event created.' + JSON.stringify(p));
        
    }).catch(function (err) {
        console.log('createTicketEvent failed info: ' + err);
    });
}

module.exports ={
    createTicketEvent
};