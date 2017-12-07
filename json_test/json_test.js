let json_cc = require('./cabcaf.1.json');
let log_array = [];

for (let i = 0; i < 10; i++)
{
    log_array.push(json_cc.data[i].name + ' | ' + json_cc.data[i].start_time + ' to ' + json_cc.data[i].end_time);
}

console.log(log_array);