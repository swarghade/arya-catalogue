const fs = require('fs')



const txtExtractPattern = /(\d*)-([^-*]+?)-(.*)/

/*/(\d*)-(.+)(?:-(.*-*.+))/gi*/

const filePattern = /(\d*)(\w*)\..*/


const tempObj = {}


let finalObj = {
    name : '',
    design: '',
    img : '',
    bg : '',
    imperial : '',
    metric: '',
    description: ''
}

let id = 3


fs.readdir('./',(err,files) => {
    if(err)
    {
        console.log(`Error -> ${err}`)
        return
    }


    for(i = 0; i < files.length; i++)
    {   
    
        let name = files[i]

        let res = name.match(filePattern)

        //console.log(`${res[1]} ${res[2]}`)

        if(!isNaN(res[1]))
        {  
            if(!tempObj[res[1]])
                tempObj[res[1]] = {}
            
            let tmp;
            tmp = res[2] ? res[2].toUpperCase() : 'IMG'

                tempObj[res[1]][tmp] = name
        
        }
        

    }

   parseNames()

    
//console.log(tempObj,'',2)


})




let finalArr = []

function parseNames(){
    let data = fs.readFileSync('names.txt','utf8')

    let split = data.split('\n')

    split.forEach( (k,i,a) => {
        //res[1] = id
        //res[2] = name
        // res[3] = design
        let res = txtExtractPattern.exec(k)

        
        
        if(res && res[1] && tempObj[res[1]])
        {
            let obj = {}
            Object.assign(obj,finalObj)
            obj.name = res[2]
            obj.design = res[3]
            obj.img = tempObj[res[1]].IMG ? `require('@/assets/${id}/${tempObj[res[1]].IMG}')` : ''
            obj.bp = tempObj[res[1]].B ? tempObj[res[1]].B : ''
            if(tempObj[res[1]].T)
                obj.imperial = tempObj[res[1]].T ? `require('@/assets/${id}/${tempObj[res[1]].T}')` : ''
            else
            {
                obj.imperial = `require('@/assets/${id}/${tempObj[res[1]].TI}')` 
                obj.metric = `require('@/assets/${id}/${tempObj[res[1]].TM}')`
            }


            finalArr.push(obj)
            
        }
        

        
        //console.log(res)
    } )


    console.log(finalArr)
    


    let culmination = {
        
    }
    culmination[id] = {}
    culmination[id].name = '37 deg Flare Fittings'
    culmination[id].dataList = finalArr

    fs.writeFileSync('output.json',JSON.stringify(culmination,'',2))
}










/*

{
    "name": "BACK FERRULE",
    "design": "ACF/BF",
    "img":  require('@/assets/p/2.png'),
    "bp": require('@/assets/p/B2.png'),
    "imperial": require('@/assets/p/T2-1.png'),
    "metric": require('@/assets/p/T2-2.png'),
    "description": ""
},

*/