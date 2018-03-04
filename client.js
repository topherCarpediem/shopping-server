
fetch("http://localhost:3000/user/register").then(result => {
    return result.json()
}).then(jsonResult => {
    console.log(jsonResult)
})