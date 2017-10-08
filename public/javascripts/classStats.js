/*global $*/
/*global Chart*/
var returnTable;
var chart;
var chartData;

$(function() {
    $.ajax({
        url:'/classStats/classNameList',
        method: 'GET',
        success : function(results){
            console.log("The results were " + results);
            //Default selection
            $('#classList').append($('<option>', {
                    value: "default",
                    text : "Select a Class"
                }));
            //Dynamic selections
            results.forEach(function(className, index){
                $('#classList').append($('<option>', {
                    value: className,
                    text : className
                }));
            });
        }
    })
});

function optionSelectPost()
{
    var option = document.getElementById("classList").value;
    if(option != "default")
    {
        $(function(){
            $.ajax({
                url : '/classStats/calculateStats',
                method : 'POST',
                dataType : 'json',
                data : {
                    className : option
                },
                statusCode: {
                    404: function () {
                      //error
                    },
                    200: function (data) {
                        //response data;
                        console.log(data);
                        returnTable = data;
                        console.log(returnTable);
                        document.getElementById("graphParts").style = "display:inline";
                    }
                }
            });
        });
    }
}

function displayInfo()
{
    if(chart != undefined)
    {
        chart.destroy();
    }
    generateDataset();
    var ctx = document.getElementById("myChart").getContext('2d');
    chart = new Chart(ctx,{
        height:100,
        width: 100,
        type: 'bar',
        data : chartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}

function generateDataset()
{
    chartData = {
        labels: [],
        datasets:[]
    };
    chartData.labels.push("Grades");
    for(var x = 0; x < 6; x++)
    {
        var element = document.getElementById("b"+ x);
        var testData;
        
        if(element.checked)
        {
            if(element.value == "male")
            {
                
                testData = {
                    label:"male",
                    backgroundColor:['rgba(100,149,237,.7)'],
                    borderColor: ['rgba(100,149,237,1)'],
                    borderWidth: [1],
                    data: [returnTable[3][0]],
                };
            }else
            if(element.value == "female")
            {
                testData = {
                    label:"female",
                    backgroundColor:'rgba(255,0,0,.7)',
                    borderColor:'rgba(255,0,0,1)',
                    data:[returnTable[3][1]],
                };
            }else
            if(element.value == "nsped")
            {
                testData = {
                    label:"N-Sped",
                    backgroundColor:'rgba(255,255,0,.7)',
                    borderColor:'rgba(255,255,0,1)',
                    data:[returnTable[5][0]],
                };
            }
            if(element.value == "sped")
            {
                testData = {
                    label:"Sped",
                    backgroundColor:'rgba(34,139,34,.7)',
                    borderColor:'rgba(34,139,34,1)',
                    data:[returnTable[5][1]],
                };
            }
            if(element.value == "nell")
            {
                testData = {
                    label:"N-Ell",
                    backgroundColor:'rgba(255,140,0,.7)',
                    borderColor:'rgba(255,140,0,1)',
                    data:[returnTable[7][0]],
                };
            }
            if(element.value == "ell")
            {
                testData = {
                    label:"Ell",
                    backgroundColor:'rgba(138,43,226,.7)',
                    borderColor:'rgba(138,43,226,1)',
                    data:[returnTable[7][1]],
                };
            }
        chartData.datasets.push(testData);
        }
    }
    console.log(chartData);
}
