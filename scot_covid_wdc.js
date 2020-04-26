// TODO paginate the queries
// TODO add selector to html to choose a dataset
// TODO power the selector with sparql
// TODO rename the 'scottish data' thing
// Change from SPARQL to CSV for this connector

(function () {
    
    var myConnector = tableau.makeConnector();


    myConnector.getSchema = function (schemaCallback) {

        dataset_uri = tableau.connectionData;
        console.log("dataset_uri:" + dataset_uri)
        //var dataset_uri = "http://statistics.gov.scot/data/household-waste"  
        /*var query = 'PREFIX qb: <http://purl.org/linked-data/cube#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT * WHERE { <' + dataset_uri + '> <http://purl.org/linked-data/cube#structure> ?structure . ?structure qb:component ?component_url . ?component_url <http://purl.org/linked-data/cube#dimension> ?dim_url . ?dim_url rdfs:label ?dim_name. }';
        var url = 'https://statistics.gov.scot/sparql.json';
        $.ajax({ 
          method: 'POST',
          dataType: 'json',
          url: url,
          data: {query: query},
          success: function(data) {
            var bindings = data.results.bindings
            sparql_chunk = "PREFIX qb: <http://purl.org/linked-data/cube#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT * WHERE { ?obs qb:dataSet <" + dataset_uri + "> . "
                
                    for (var i = 0, len = bindings.length; i < len; i++) {
                        var dim_name = bindings[i].dim_name.value
                        var dim_name_nosp = dim_name.replace(/\s+/g, '');
                        cols_tableau.push({id:dim_name_nosp,dataType: tableau.dataTypeEnum.string})
                        sparql_chunk += ("?obs <" + bindings[i].dim_url.value + "> ?" + dim_name_nosp + "_uri . ?" + dim_name_nosp + '_uri rdfs:label ?' + dim_name_nosp + '_label . ')
                        dim_value = "bindings[i]." + dim_name_nosp + "_label.value"
                        push_text.push({colname:dim_name_nosp,colval: dim_value})
                      };
            cols_tableau.push({id:'value', dataType: tableau.dataTypeEnum.float})
            cols_tableau.push({id:'mtype', dataType: tableau.dataTypeEnum.string})
            cols_tableau.push({id:'unit', dataType: tableau.dataTypeEnum.string})
            push_text.push({colname:'value',colval:'bindings[i].value_label.value'})
            push_text.push({colname:'mtype',colval:'bindings[i].mtype_label.value'})
            push_text.push({colname:'unit',colval:'bindings[i].unit_label.value'})
            sparql_chunk += "?s a <http://purl.org/linked-data/cube#MeasureProperty> ; rdfs:label ?mtype_label . ?obs ?s ?value_label . ?obs <http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure> ?unit_url . ?unit_url rdfs:label ?unit_label. } LIMIT 1000"
            
            var tableSchema = {
                id: "ScotData",
                alias: "Scottish_data",
                columns: cols_tableau

            };
            console.log("getSchema" + sparql_chunk)
            console.log(JSON.stringify(push_text))   
            schemaCallback([tableSchema]);

          }
        });*/

        var cols_tableau = [{
        id: "FeatureCode",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "DateCode",
        dataType: tableau.dataTypeEnum.date
    }, {
        id: "Measurement",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "Units",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "Value",
        dataType: tableau.dataTypeEnum.float
    }, {
        id: "Variable",
        dataType: tableau.dataTypeEnum.string
    }];

        var tableSchema = { 
            id: "ScotData",
            alias: "Scottish_data",
            columns: cols_tableau
            }
    	
    schemaCallback([tableSchema]);
     

    

    tableau.log("Hello WDC!");

	};

    myConnector.getData = function(table, doneCallback) {

        
        console.log("Getting data")

        //var dataset_uri = "https://cors-anywhere.herokuapp.com/https://statistics.gov.scot/downloads/cube-table?uri=http%3A%2F%2Fstatistics.gov.scot%2Fdata%2Flooked-after-children"
        var dataset_uri = "https://cors-anywhere.herokuapp.com/https://statistics.gov.scot/downloads/cube-table?uri=http%3A%2F%2Fstatistics.gov.scot%2Fdata%2Fcoronavirus-covid-19-management-information"
        $.ajax({
            method: 'GET',
            dataType: 'text',
            url: dataset_uri,
            success: function(data) {
                //console.log("Data:" + data)
                var tableArray = []
                var array = Papa.parse(data)
                array.data.splice(0,1)
                console.log(array.data[0])
                console.log(array[0])
                //console.log(data)
                //console.log(data[1])
                //console.log(array[1])
                table.appendRows(array.data);
                //table.splice(0,1)
                //tableArray.push(array.data[1])
                console.log(table)
                doneCallback();
            }
        })
        /*console.log("getData: " + sparql_chunk)
    	//var query = 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?areaname ?value WHERE {?obs <http://purl.org/linked-data/cube#dataSet> <http://statistics.gov.scot/data/household-waste> . ?obs <http://purl.org/linked-data/sdmx/2009/dimension#refArea> ?areauri . ?obs <http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> <http://reference.data.gov.uk/id/year/2016> . ?obs <http://statistics.gov.scot/def/measure-properties/ratio> ?value . ?areauri rdfs:label ?areaname . } LIMIT 100';
        //var dataset_uri = "http://statistics.gov.scot/data/household-waste"  
        //var query = 'PREFIX qb: <http://purl.org/linked-data/cube#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT * WHERE { <' + dataset_uri + '> <http://purl.org/linked-data/cube#structure> ?structure . ?structure qb:component ?component_url . ?component_url <http://purl.org/linked-data/cube#dimension> ?dim_url . ?dim_url rdfs:label ?dim_name. }';
		var query = sparql_chunk
        var url = 'https://statistics.gov.scot/sparql.json';
		$.ajax({ 
			method: 'POST',
			dataType: 'json',
			url: url,
			data: {query: query},
			success: function(data) {
                var bindings = data.results.bindings,
                    tableData = [],
                    tempData = {},
                    colData,
                    colnames = ""
				//console.log(push_text)
                //push_text_json = JSON.parse(push_text)
                //console.log(push_text_json)
                // for (var j = 0, col_len = cols_tableau.length; j < col_len; j++) {
                //         //console.log(cols_tableau[j].id);
                //         colnames += "{'" + cols_tableau[j].id + "': bindings[i]." + cols_tableau[j].id + "_label.value}, "
                //     }
                //colnames_nocomma = colnames.substring(0,(colnames.length - 2))
                
                //cols_test = "'ReferenceArea': bindings[i].ReferenceArea_label.value, 'ReferencePeriod': bindings[i].ReferencePeriod_label.value, 'measuretype': bindings[i].measuretype_label.value, 'WasteManagement': bindings[i].WasteManagement_label.value, 'WasteCategory': bindings[i].WasteCategory_label.value"
                //cols_test = '{"ReferenceArea": bindings[i].ReferenceArea_label.value}'
                //colstest_json = JSON.stringify(cols_test)
                //console.log(colstest_json)
                for (var i = 0, len = bindings.length; i < len; i++) {
                   
                    for (var j = 0, len_col = push_text.length; j < len_col; j++) {
                        
                        jwkey = push_text[j]["colname"]
                        jwval = eval(push_text[j]["colval"])
                    
                        tempData[ jwkey ] = jwval
                        
                    }
                  
                    tableData.push(tempData);
                    tempData = {}
                    

                }
                    
                
            table.appendRows(tableData);
            doneCallback();
			}
		});*/
        
}; 

    tableau.registerConnector(myConnector);
})();
var cols_tableau = [],
    sparql_chunk = "",
    push_text = [],
    dataset_uri = ""
    

$(document).ready(function () {

    $("#submitButton").click(function () {
        console.log("hello");
        dataset_uri = $('#sel1 option:selected').attr('id');
        console.log("dataset_uri:" + dataset_uri)
        tableau.connectionData = dataset_uri;
        tableau.connectionName = "Test Scot Data";
        tableau.submit();

    });
});