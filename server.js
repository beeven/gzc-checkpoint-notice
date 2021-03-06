var express = require("express"),
    app =   express(),
    dataProvider = require("./../CheckPointNotice/dataProvider");

var dp = new dataProvider();

app.listen(8081);

app.use(express.static(__dirname+"/public"));

app.get("/notifyme",function(req,res){
    res.writeHead(200,{
        "Content-Type":"text/event-stream",
        "Cache-Control":"no-cache",
        "Connection":"Keep-Alive"
    });

    dp.on("data",function(data){
        console.log(data);
        for(var index=0;index < data.length; i++) {
            res.write("id: " + data[index].id + "\n");
            res.write("data: " + JSON.stringify(data[index]) + "\n\n");
        }
    });

    dp.start();

    res.on('close',function(){
        console.log("res.close");
        dp.off("data");
        dp.stop();
    });
});

app.get("/currentList/:index",function(req,res){
    var index = req.params.index;
    var filter = req.query.filter;
    dp.fetch(index,filter).then(function(data){
        res.json(data);
    });
});

app.get("/currentList/allFrom/:fromId",function(req,res){
    var index = req.params.fromId;
    dp.fetchGreater(index).then(function(data){
        res.json(data);
    })
});