const clientModel = require("./../database/models/clientModel");
const axios = require("axios");
const panelClients = require("./../database/models/panelClients");
require("dotenv").config()
const fs = require('fs')
const util = require('util');



module.exports.getPanelUsers = async function () {
    try {
        let panelRequest = await axios.get(process.env.PTERO_URL + "application/servers", {
            "headers": {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.PTERO_API_KEY
            }
        });

        panelRequest.data.data.map(async server => {
            getPanelForUser(server.attributes.user, server.attributes.username).then(async (datas) => {
                panelClients.findOne({panelId: server.attributes.id}, async (err, data) => {
                    if (err) throw err;


                    if (!data) {
                        const newClient = new panelClients({
                            discordId: datas.discordId,
                            databaseId: server.attributes.id,
                            panelId: server.attributes.id,
                        });
                        await newClient.save();
                    }
                     else {
                    }

                })
            });
        })
    } catch (e) {
        console.log(e.response.data.errors)
    }
}
async function getPanelForUser(userid) {
    try {
        let request = await axios.get(process.env.PTERO_URL + "application/users/" + userid, {
            "headers": {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.PTERO_API_KEY
            }
        })
        clientModel.findOne({discordId: request.data.attributes.username}, async (err, data) => {
            if (err) throw err;
            if (!data) {
                return null
            } else {
                let offres = data.offresCount;
                offres++;
                clientModel.findOneAndUpdate({discordId: request.data.attributes.username}, {offresCount: offres}, (err, data) => {
                    if (err) throw err;
                })

            }
        })

        return {discordId: request.data.attributes.username};

    } catch (e) {
        console.log(e.response.data.errors)
    }

}

