
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let walletSchema = new Schema({
    walletID: {
        type: String
    },
    walletOwner: {
        type: String,
        unique: true
    },
    walletEntity: {
        type: String
    },
    walletDescription: {
        type: String
    },
    walletEntity: {
        type: String
    }
}, {
    collection: 'wallets'
})

module.exports = mongoose.model('Wallet', walletSchema)