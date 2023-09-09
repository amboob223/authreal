
const email = document.getElementById("email");
const password = document.getElementById("password");
const button = document.getElementById("btn");
 
button.addEventListener("click",async(event)=>{
    event.preventDefault();
    if(password !== confirmedPassword){
        return "this is not right "
    }
    await fetch(`${process.env.REACT_URL}/${endpoint}`)
})