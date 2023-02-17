let fs = require('fs');
const http = require('http');

const port = 8000;

const server = http.createServer(function(request, response){
    //When it recieves a request:
    //console.log("request", "recieved request");
    const URL = request.url;
    const arrURL = URL.split("/");
    const index = parseInt(arrURL[2]);
    
    //console.log("Logging URL:" , URL);
    //console.log(index);

    if (arrURL[1] == "pets"){
        fs.readFile("./pets.json", "utf8", function(error, data){
            let allPets = JSON.parse(data)
            //console.log("allPets variable" , allPets)
            
            if (error){
                response.setHeader('Content-Type', 'application/json');
                response.statusCode = 404;
                response.end("internal server error")
                return;
            } else {
                if (arrURL.length >= 2){
                    if (index > allPets.length -1 || index < 0){
                        response.setHeader('Content-Type', 'application/json');
                        response.statusCode = 404;
                        response.end("internal server error");
                        return;                      
                    } else {
                        response.setHeader('Content-Type', 'application/json');
                        response.statusCode = 200;
                        response.end(JSON.stringify(allPets[index])); 
                    }
                    
                } else{
                    response.setHeader('Content-Type', 'application/json');
                    response.statusCode = 200;
                    response.end(JSON.stringify(allPets));
                };
            };
        });
    };

});

server.listen(port, ()=>{
    console.log(`listening on port ${port}`)
});