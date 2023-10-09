import initialiseServer from "./app";

async function init(){
    const app = await initialiseServer();
    app.listen(8000, ()=>{
        console.log("Server started at 8000");
    })
}
init();