const csvFilePath = 'data/Blocks-IPv4.csv'
const City_csvFilePath = 'data/City-Locations.csv'
const csv = require('csvtojson')
const ipInt = require("ip-to-int");
const IPCIDR = require("ip-cidr");
var redis = require("redis");
const client = redis.createClient();
client.on("error", function(err) {
    console.log("Error " + err);
});
client.connect()
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        for (i in jsonObj) {
            const cidr = new IPCIDR(jsonObj[i].network);
            start_ip_int = ipInt(cidr.start()).toInt();
            end_ip_int = ipInt(cidr.end()).toInt();
            jsonObj[i]["network"] = JSON.stringify(start_ip_int)
            var jsondata_start = JSON.stringify(jsonObj[i])
            client.zAdd('ip-loc', {
                score: start_ip_int,
                value: jsondata_start
            })
            jsonObj[i]["network"] = JSON.stringify(end_ip_int)
            var jsondata_end = JSON.stringify(jsonObj[i])
            client.zAdd("ip-loc", {
                score: end_ip_int,
                value: jsondata_end
            })
        }
        console.log("Imported all IP block records to Redis");
    })


csv()
    .fromFile(City_csvFilePath)
    .then((jsonObj) => {
        for (i in jsonObj) {
            client.json.set(i, '$', jsonObj[i])
        }
        console.log("Imported all IP to City mapping records to Redis");
    })
