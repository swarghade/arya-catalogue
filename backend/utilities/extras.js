function filterSchema(schema,obj,exclusion){
    return Object.keys(obj).filter( (k) =>  schema.includes(k) && !exclusion.includes(k)  ).reduce((acc,current) =>  ({ ...acc,[current] : obj[current] }),[])
}

const merge=(t,s)=>{let o=Object,a=o.assign;for(let k of o.keys(s))s[k]instanceof o&&a(s[k],merge(t[k],s[k]));return a(t||{},s),t}


module.exports = {
    filterSchema,
    merge
}
