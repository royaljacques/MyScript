const PanelToMongo = require('./PanelToMongo.js');
const PanelServerToMonitor = require('./PanelServerToMongo.js');
const database = require("../database/databaseConnect");
try {
    database.connect(process.env.MONGO_URI);
    console.log("database connect ")
} catch (e) {
    console.log(e);
}

PanelToMongo.getPanelUsers();
PanelServerToMonitor.getPanelUsers();