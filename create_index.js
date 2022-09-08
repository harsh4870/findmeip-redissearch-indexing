import {createClient, SchemaFieldTypes, AggregateGroupByReducers, AggregateSteps} from 'redis';
const client = createClient();

client.on("error", function(err) {
    console.log("Error " + err);
});

client.connect()

try {
    await client.ft.create('idx:ipIdx', {
        '$.geoname_id': {
            type: SchemaFieldTypes.TEXT,
            AS: 'geoname_id'
        }
    }, {
        ON: 'JSON'
    });
} catch (e) {
    if (e.message === 'Index already exists') {
        console.log('Index exists already, skipped creation.');
    } else {
        console.error(e);
        process.exit(1);
    }
}
