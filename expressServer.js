// //SETUP DEPENDEICIES:
// const express = require('express');
// const app = express();
// const fs = require('fs');
// const port = 8000;
// app.use(express.json());


// //WHEN "PETS" IS TYPED IN:
// app.get('/pets/' , function (request, response, next){
//     fs.readFile("./pets.json", function (error, data){
//         const allPets = JSON.parse(data);
    
//         if (error){
//             next({});
//         } else {
//             response.send(allPets)
//         }
//     })
// })


// //CHECKS FOR ANYTHING OTHER THAN "PETS" AND SENDS ERROR:
// app.get("/:word/", function (request, response){
//     const word = request.params.word;
//     response.status(505).send(`NOT FOUND!! - 505 error - /${word}/ does not exist`);
// });


// //FOR AN INDEX SEARCH, ERROR IF INDEX DOESNT EXIST:
// app.get('/pets/:id/' , function (request, response, next){
//     const index = parseInt(request.params.id);
//     console.log("index from pets object:" , index);
    
//     fs.readFile("./pets.json", function (error, data){
//         let allPets = JSON.parse(data);

//         if (index < 0 || index >= allPets.length || typeof(index) !== "number"){
//         next({});
//         } else{
//             response.send(allPets[index]);
//         };      
//     });
    
// });

// //WHEN POSTING, WRITE TO FILE:
// app.post("/pets/", function (req, res){
//     const reqData = req.body;
//     //console.log("reqData", reqData);

//     fs.readFile("./pets.json", function (error, data){
//         let allPets = JSON.parse(data);
//         const index =  allPets.length;
//         allPets[index] = reqData;
//         //console.log(allPets);

//         allPets = JSON.stringify(allPets);
//         fs.writeFile('./pets.json', allPets, function (error){
//         })

//     });    
//         res.send("ok");      
// })


// //PUT request to /pets/:id
// //Update a pet with that ID
// app.put("/pets/:id/", function (req, res, next){
//     //Update pet with that ID
//     const reqData = req.body;
//     const index = parseInt(req.params.id);
//     console.log(index);

//     fs.readFile("./pets.json", function (error, data){
//         let allPets = JSON.parse(data);

//         if (index < 0 || index >= allPets.length){
//             console.log("outside of PUT index conditional");
//             next({})
//         } else {
//             allPets[index] = reqData;
//             //console.log(allPets);
    
//             allPets = JSON.stringify(allPets);
//             fs.writeFile('./pets.json', allPets, function (error){
//                 res.send("update accepted");
//             })
//         }
//     });     
// })


// app.patch('/pets/:id', (req, res, next) => {
//     fs.readFile(petsPath, 'utf8', (readErr, petsJSON) => {
//       if (readErr) {
//         return next(readErr);
//       }
  
//       const id = Number.parseInt(req.params.id);
//       const pets = JSON.parse(petsJSON);
  
//       if (id < 0 || id >= pets.length || Number.isNaN(id)) {
//         return res.sendStatus(404);
//       }
  
//       const pet = pets[id];
//       const age = Number.parseInt(req.body.age);
//       const kind = req.body.kind;
//       const name = req.body.name;
  
//       if (!Number.isNaN(age)) {
//         pet.age = age;
//       }
  
//       if (kind) {
//         pet.kind = kind;
//       }
  
//       if (name) {
//         pet.name = name;
//       }
  
//       const newPetsJSON = JSON.stringify(pets);
  
//       fs.writeFile(petsPath, newPetsJSON, (writeErr) => {
//         if (writeErr) {
//           return next(writeErr);
//         }
  
//         res.send(pet);
//       });
//     });
//   });


// //Delete a pet
// app.delete("/pets/:id", function (req, res, next){
//     const index = parseInt(req.params.id);

//     fs.readFile("./pets.json", function (error, data){
//         let allPets = JSON.parse(data);
//         console.log("before",allPets.length);
//         allPets.splice(index,1);
//         console.log("after",allPets.length);
        
//         if (index < 0 || index > allPets.length){
//             console.log("its going here from delete");
//             next({});
//         }

//         allPets = JSON.stringify(allPets);
//         fs.writeFile('./pets.json', allPets, function (error){
//         })
       
//     });    

// })

// //RUN FOR 404 ERRORS:
// app.use(function (err, req, res, next){
//     console.log("inside app.use callback");
//     res.status(404).send("Not found - 404 error");
// });


// app.listen (port, function (){
//     console.log(`server is running/listening on port ${port}`)
// });


// set up dependencies
const express = require('express');
const app = express();
// express.static(root); // root, or source of the static files can also be chained with [options]
// app.use(express.static('assets'));
const fs = require('fs');
const next = require('process');
// const colors = require('colors/safe');
const { Pool } = require('pg');

app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    datbase: 'petshop',
    password: 'password',
    port: 5432,
});

// handle requests with routes
app.get('/pets', (req, res, next) => {

    const result = pool.query('SELECT * FROM pets', (err, result) => {
        if (err) {
            return next(err);
        };

        const rows = result.rows;
        console.log(rows);
        res.send(rows);
    });

    // fs.readFile('./assets/pets.json', (err, data) => {
    //     if (err) {
    //         next(err);
    //     };
    //     const allPets = JSON.parse(data);
    //     res.send(allPets);
    // });
});

// Get pet by id (index where it sits in the array)
app.get('/pets/:id/', (req, res, next) => {
    
    const id = Number.parseInt(req.params.id);
    const result = pool.query('SELECT name, kind, age FROM pets WHERE id = $1', [id], (err, result) => {
        if (err) {
            return next(err);
        };
        const pet = result.rows[0];
        console.log(pet);
        res.send(pet);
    }) 
    
    // if (error) {
    //     throw new Error(error);
    // };
    // const id = req.params.id;
    // fs.readFile('./assets/pets.json', (err, data) => {
    //     if (err) {
    //         throw new Error(err);
    //     };
    //     const requestedPet = JSON.parse(data);
    //     res.json(requestedPet[id]);
    // }); 
});

// Add a pet to array
app.post('/pets', (req, res, next) => {
    fs.readFile('./assets/pets.json', (err, data, next) => {
        // const name = req.body.name;
        // const age = Number.parseInt(req.body.age);
        // const kind = req.body.age;
        console.log(req.body);
        const jsonData = JSON.parse(data);
        jsonData.push(req.body);
        fs.writeFile('./assets/pets.json', JSON.stringify(jsonData), (err) => {
            res.status(200).json(jsonData);
        });
    });
});

// Update a pet by id number
app.delete("/pets/:id", (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    const result = pool.query('DELETE FROM pets WHERE id = $1', [id], (err, result) => {
        if (err) {
            return next(err);
        };
        console.log(result);
        res.send(result);
    });
});

app.patch("/pets/:id", (req, res, next) => {
    const petId = req.params.id;
    const updatedPet = req.body;
    fs.readFile('./assets/pets.json', (err, data) => {
        if (err) {
            return next(err);
        };
        const pets = JSON.parse(data);
        if (petId === -1) {
            return res.status(404).json({ message: `Pet with ID ${petId} does not exist`});
        };
        const updatedPetInfo = { ...pets[petId], ...updatedPet };
        pets[petId] = updatedPetInfo;

        fs.writeFile('./assets/pets.json', JSON.stringify(pets), (err) => {
            if (err) {
                return next(err);
            };
            res.status(200).json(updatedPetInfo);
        });

    });
});

app.use((error, req, res, next) => {
    console.error(error);
    // res.render('errorPage'); // renders an error page
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || "Not found, my guy!",
        }
    });
});




// listen on a port
const port = process.env.port || 8000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});