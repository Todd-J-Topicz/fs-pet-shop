let fs = require('fs');

let input = process.argv[2];

//console.log("This is your input:" , input);

if (input === "create" || input === "read" || input === "update" || input === "delete") {
    console.log("Input:" , input)
    if (input === "create"){
        createData()
    }
    if (input === "read"){
        readData()
    }
    if (input === "update"){
        updateData()
    }
    if (input === "delete"){
        deleteData()
    }

} else {
    console.log("Error")
    process.exit(1);
}


function createData(){
    let ageVar = parseInt(process.argv[3]);
    let kindVar = process.argv[4];
    let nameVar = process.argv[5];
    let newPet = {};
    newPet.age = ageVar;
    newPet.kind = kindVar;
    newPet.name = nameVar;
    
    fs.readFile('./pets.json', 'utf8', function(error, data){
        data = JSON.parse(data);
        console.log(data);

        if (nameVar === undefined || kindVar === undefined || ageVar === undefined){
            console.log("You did not enter all correct data necessary")
            process.exit(1);
        } else {
            data.push(newPet);
            data = JSON.stringify(data);
            fs.writeFile('./pets.json', data, function (error){
            })
        }
    });
}

function readData(){
    let index = parseInt(process.argv[3]);

    fs.readFile('./pets.json', 'utf8', function(error, data){
        data = JSON.parse(data);
            if (data){
                console.log(data);

                if (data[index] === undefined){
                    console.log("Pet does not exists")
                } else {
                    console.log(data[index])
                }
            } else {
                console.log("No object exists", error)
            }
    })
}


function updateData(){
    let index = process.argv[3];
    let newage = parseInt(process.argv[4]);
    let newkind = process.argv[5];
    let newname = process.argv[6];
    fs.readFile('./pets.json', 'utf8', function(error, data){
        data = JSON.parse(data);
        if(newage && newkind && newname){
            data[index].age = newage;
            data[index].kind = newkind;
            data[index].name = newname;
        }
        if(newage && newkind && !newname){
            data[index].age = newage;
            data[index].kind = newkind;
        }
        if(newage && !newkind && !newname){
            data[index].age = newage;
        }
        data = JSON.stringify(data);
        fs.writeFile('./pets.json', data, function (error){
        })
    })
}

function deleteData(){

}