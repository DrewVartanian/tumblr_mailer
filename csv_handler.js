var fs = require('fs');

function parse(csvFile){
	//Read csv file to string
	var csvStr = fs.readFileSync(csvFile,"utf8");
	//Parse string to array by new line
	var csvArr = csvStr.split("\n");
	var csvKeys = csvArr[0].split(",");
	var csvData = [];
	var values;

	for(var i=1;i<csvArr.length;i++){
		csvValues = csvArr[i].split(",");
		if(csvKeys.length===csvValues.length){
			values = {};
			for(var j=0;j<csvKeys.length;j++){
				values[csvKeys[j]]=csvValues[j];
			}
			csvData.push(values);
		}
	}
	return csvData;
}

module.exports.parse = parse;