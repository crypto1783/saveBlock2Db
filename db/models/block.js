const sq  = require('../sequelize');
const Sequelize = require('sequelize');
var Block = sq.define(
    'block',
    {
        id: {
            type: Sequelize.BIGINT(32),
            primaryKey: true,
            autoIncrement: true
        },
        block_hash: Sequelize.STRING(128),
        block_num: Sequelize.STRING(64),
        parent_hash: Sequelize.STRING(128),
        state_root: Sequelize.STRING(128),
        extrinsic_root: Sequelize.STRING(128)     
    }, 
    {
        timestamps: false
    },
    {
        tableName: 'blocks'
    }
);

async function createBlock (block)
{
    Block.create(block).then(function (p)
    {
        //console.log("insert block num:", p.blockNum);
        //console.log('block created.' + JSON.stringify(p));
        
    }).catch(function (err) {
        console.log('createBlock failed info: ' + err);
    });
}

async function findBlock (blockHash)
{
    var blocks = await Block.findAll({
        where: {
            block_hash: blockHash 
        }
    });
    return blocks;
}

function saveBlock(signedBlock, blockNum) {
    const blockHash = signedBlock.block.header.hash.toHuman();
    const blockHeader = signedBlock.block.header;
    const parentHash = blockHeader.parentHash.toHuman();
    const stateRoot = blockHeader.stateRoot.toHuman();
    const extrinsicRoot = blockHeader.extrinsicsRoot.toHuman();

    const block = {
        id: null,
        block_hash: blockHash,
        block_num: blockNum,
        parent_hash: parentHash,
        state_root: stateRoot,
        extrinsic_root: extrinsicRoot
    };
    createBlock(block);
}

module.exports ={
    createBlock,findBlock, saveBlock
} ;