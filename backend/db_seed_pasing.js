var fs = require('fs');
const titleMapping = {
    "Timestamp": {db_field: 'timestamp', type: 'datetime'},
    "Employer": {db_field: 'employer', type: 'string'},
    "Job Title": {db_field: 'job_title', type: 'string'},
    "Years at Employer": {db_field: 'year_employer', type: 'number'},
    "Years of Experience": {db_field: 'year_exp', type: 'number'},
    "Annual Base Pay": {db_field: 'base_pay', type: 'number'},
    "Signing Bonus": {db_field: 'signing_bonus', type: 'number'},
    "Annual Bonus": {db_field: 'annaul_bonus', type: 'number'},
    "Annual Stock Value/Bonus": {db_field: 'annual_stock', type: 'number'},
    "Gender": {db_field: 'sex', type: 'string'},
}

function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)
  
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }
  
fs.readFile('../shared/salary_datasets/salary_survey-3.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    var obj = JSON.parse(data);
    console.log(obj)
    const converted = obj.map((row) => {
        const _row = {}
        for (const [origin, prop] of Object.entries(titleMapping)){
            let val = row[origin]
            switch(prop.type){
                case('number'):
                    const num_val = row[origin].replace(/\D/g, "")
                    val = num_val? parseInt(num_val): 0
                    break;
                case('datetime'):
                    val = `"${row[origin]}"`
                    break;
                default:
                    val = `"${row[origin]}"`
            }
            _row[prop.db_field] = val
        }
        return _row
    })
    console.log(converted)
    fs.writeFile ("./postgres/seed/dummy.csv", convertToCSV(converted), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
});