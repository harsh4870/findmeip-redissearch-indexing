var redis = require("redis");
const ipInt = require("ip-to-int");
const client = redis.createClient();

client.on("error", function(err) {
    console.log("Error " + err);
});

function int_to_ip(ip) {
    try {
        const int_ip = ipInt(ip).toInt();
        return int_ip
    } catch (e) {
        console.log("Error while converting IP to Int hax", e)
    }
}

async function ip_redis(ip) {
    await client.connect()
    const ip_int = int_to_ip(ip)
    const geoname_id = await client.zRangeByScore('ip-loc', ip_int, '+inf', {
        LIMIT: {
            count: 1,
            offset: 0
        }
    })
    const json_data = JSON.parse(geoname_id[0])
    console.log("Geoname ID : ", json_data.geoname_id)
    const city_data = await client.ft.search('idx:ipIdx', `@geoname_id:(${json_data.geoname_id})`)
    console.log("City data for IP", city_data.documents)
}

ip_redis("1.0.0.1")
