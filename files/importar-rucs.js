const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('./rucs/ruc0.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  let count = 0;
  let importfile = []
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    let array = line.split('|')
    if(array[1].indexOf(",")>-1){
      let nombre_apellido = array[1].split(',');
    // console.log("ruc: "+array[0]+" Razon Social: "+array[1]+" DIV:"+array[2]);

      try {
        let newRucs = {
          user: {
            $oid: "61030b6c5c99a66b8c4fe0c1"
          },
          tipoEgreso: {
            $oid: "610318088e014fb5a103c5ab"
          },
          ruc: array[0],
          div: array[2],
          razonSocial: nombre_apellido[1].trim()+" "+nombre_apellido[0].trim(),  
          user_created: "admin",
          user_updated: "admin"
          }
          importfile.push(newRucs)

      } catch (error) {
        console.log(error )
        console.log("Error en la linea "+count)

        break;
      }
    }else{
      try {
        let newRucs = {
          user: {
            $oid: "61030b6c5c99a66b8c4fe0c1"
         },
          tipoEgreso: {
            $oid: "610318088e014fb5a103c5ab"
          },
          ruc: array[0],
          div: array[2],
          razonSocial: array[1].replace(/\"/g,''),  
          user_created: "admin",
          user_updated: "admin"
          }
          importfile.push(newRucs)

      } catch (error) {
        console.log(error )
        console.log("Error en la linea "+count)

        break;
      }
    }
    

    count++;
   if (count == 400 )break;

  }

(
  //fs.writeFile("./import/test", JSON.stringify(importfile) , function(err) {
    fs.writeFileSync("./import/ruc0.json", JSON.stringify(importfile), 'utf-8'), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  }); 

}

processLineByLine();
