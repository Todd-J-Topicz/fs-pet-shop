//SETUP DEPENDEICIES:
const express = require('express');
const app = express();
const fs = require('fs');
const port = 8000;
app.use(express.json());
const { Pool } = require('pg');
const { listenerCount } = require('stream');

const pool = new Pool ({
    user: 'postgres',
    host: '127.0.0.1',
    databse: 'petshop',
    password: 'password',
    port: 5432,
})


//WHEN "PETS" IS TYPED IN:
app.get('/pets/' , function (request, response, next){
    pool.query('SELECT * FROM pets', function(err,result){
        if (err){
            return next({})
        }

    const rows = result.rows;
    console.log(rows);
    response.send(rows);
    })
})


//CHECKS FOR ANYTHING OTHER THAN "PETS" AND SENDS ERROR:
app.get("/:word/", function (request, response){
    const word = request.params.word;
    response.status(505).send(`NOT FOUND!! - 505 error - /${word}/ does not exist`);
});


//FOR AN INDEX SEARCH, ERROR IF INDEX DOESNT EXIST:
app.get('/pets/:id/' , function (request, response, next){
    const id = Number.parseInt(request.params.id);
    pool.query('SELECT * FROM pets WHERE id = $1', [id], function(error,result){
        if (error){
            return next({})
        }

    //Since we are only expecting one result from querry, we can select at index [0]
    const pet = result.rows[0];
    console.log("Single pet:", id, "values" , pet)
    response.send(pet);
    })

    
});

//WHEN POSTING, WRITE TO FILE:
app.post("/pets/", function (req, res, next){
    const name = req.body.name;
    const age = Number.parseInt(req.body.age);
    const kind = req.body.kind;

    if (!age || !kind || !name || Number.isNaN(age)){
        return res.status(400).send("ERROR")
    }else {
        pool.query('INSERT INTO pets (name, kind, age) VALUES ($1, $2, $3) RETURNING *;', [name, kind, age], (err, result){
            if (err){
                return next({})
            }

            let petInfo = result.rows[0];
            res.status(200).send(petInfo);
        })
    }

})


//PUT request to /pets/:id
//Update a pet with that ID
app.put("/pets/:id/", function (req, res, next){
    
         
});


app.patch('/pets/:id', (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    let name = req.body.name;
    let age = Number.parseInt(req.body.age);
    let kind = req.body.kind;

    pool.query('SELECT * FROM pets WHERE id = $1', [id], function(err, data){
        if (err){
            next({});
        }

        let pet = data.rows[0];
        if (!pet){
            res.status(404).send("Pet does not exist");
        }
        
        let updatedName = null;
        if (name){
            updatedName = name;
        } else {
            updatedName = pet.name;
        }

        const updatedKind = kind || pet.kind;
        const updatedAge = age || pet.age;


        pool.query('UPDATE pets SET name=$1, kind=$2, age=$3 WHERE id=$4 RETURNING *', [updatedName, updatedKind, updatedAge, id], function (err, data){
            if (err){
                next({})
            };
        })
    });
});


//Delete a pet:
app.delete("/pets/:id", function (req, res, next){
    const id = Number.parseInt(req.params.id);   
    pool.query('DELETE FROM pets WHERE id=$1 RETURNING *', [id], function(err, data){
        if (err){
            return next({});
        }
        
        const deleted = data.rows[0];
        if (deleted){
            res.send(deleted);
        } else {
            res.sendStatus(404);
        }
        
    })
})

//RUN FOR 404 ERRORS:
app.use(function (err, req, res, next){
    console.log("inside app.use callback");
    res.status(404).send("Not found - 404 error");
});


app.listen (port, function (){
    console.log(`server is running/listening on port ${port}`)
});