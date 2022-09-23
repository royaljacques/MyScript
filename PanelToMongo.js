

const clientModel = require("./../database/models/clientModel");
const axios = require("axios");
require("dotenv").config()
const fs = require('fs')
const util = require('util');
const database = require("./../database/databaseConnect");

module.exports.getPanelUsers =  async function () {


    console.log("panelUser2")
    try {
        let request = await axios.get(process.env.PTERO_URL + "application/users", {
            "headers": {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.PTERO_API_KEY
            }
        })

        request.data.data.map(async user => {
            let username = user.attributes.username;
            let id = user.attributes.id;
            let firstName = user.attributes.first_name;
            let lastName = user.attributes.last_name;
            let email = user.attributes.email;




            if (Number.isInteger(parseInt(username))) {
                clientModel.findOne({discordId: username}, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        const newClient = new clientModel({
                            discordId: username,
                            name: firstName,
                            surname: lastName,
                            email: email,
                            offresCount:0,
                        });
                        await newClient.save();
                    } else {
                       // console.log("User already in database");

                    }
                })

            } else {
                let userJson =
                    `{
  "username": "${username}",
  "email": "${email}",
  "name": "${firstName}",
  "surname": "${lastName}",
  "id": "${id}"
}`
                try {
                    let log_file = fs.createWriteStream(__dirname + '/NotVerified/' + username + '.json', {flags: 'w'});
                    log_file.write(userJson);

                } catch (e) {
                    console.log(e)
                }

            }
        })



    } catch (e) {
        console.log(e.response)
    }

}

