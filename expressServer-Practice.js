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
});

//GET request to pets/num 
//Gives back the data for pet with that ID (usually a DB primary key):
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


//POST to "/pets/"
//Create a new pet resource 
app.post("/pets/", function (req, res){
    const age = Number.parseInt(req.body.age);
    const {kind, name} = req.body;
    
    fs.readFile("./pets.json", function (error, data){
        //turn string into a JSON object for data manipulation:
        let allPets = JSON.parse(data);
        
        if (!age || !kind || Number.isNaN(age) || !name){
            return res.sendStatus(400);
        } 

        const newPet = {age: age, kind: kind, name: name};
        allPets.push(newPet);
        allPets = JSON.stringify(allPets);

        fs.writeFile('./pets.json', allPets, function (error){
            if (error){
               return next({}); 
            }
             
            res.send("ok" , newPet); 
            
        })

    });    
             
});


//PUT request to /pets/:id
//Update a pet with that ID
app.put("/pets/:id/", function (req, res, next){
    //Update pet with that ID
})


app.patch("/pets/:id", function (req, res, next){
    //Update part of a pet's data with that ID
})


//Delete a pet
app.delete("/pets/:id", function (req, res, next){
    //Delete a pet's data with that ID
})


//RUN FOR 404 ERRORS:
app.use(function (err, req, res, next){
    console.log("inside app.use callback");
    res.status(404).send("Not found - 404 error");
});


app.listen (port, function (){
    console.log(`server is running/listening on port ${port}`)
});