//SETUP DEPENDEICIES:
const express = require('express');
const app = express();
const fs = require('fs');
const port = 8000;
app.use(express.json());


app.get('/pets/' , function (request, response, next){
    fs.readFile("./pets.json", function (error, data){
        const allPets = JSON.parse(data);
    
        if (error){
            next({});
        } else {
            response.send(allPets)
        }
    })
})

app.get("/:word/", function (request, response, next){
    const word = request.params.word;

    response.status(505).send("Not found - 505 error");
})

app.get('/pets/:id/' , function (request, response, next){
    const index = parseInt(request.params.id);
    console.log("index from pets object:" , index);
    
    fs.readFile("./pets.json", function (error, data){
        let allPets = JSON.parse(data);

        if (index < 0 || index >= allPets.length || typeof(index) !== "number"){
            next({});
        } else{
            response.send(allPets[index]);
        };      
    });
});

app.use(function (err, req, res, next){
    console.log("inside app.use callback");
    res.status(404).send("Not found - 404 error");
});

app.post("/pets", function (req, res){
    const reqData = req.body;
    console.log("reqData", reqData);
    //NEED TO APPEND REQDATA TO PETS.JSON
    res.send("ok")
})

app.listen (port, function (){
    console.log(`server is running/listening on port ${port}`)
});