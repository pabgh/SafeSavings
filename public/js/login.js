//captura os campos do formulário de login e envia para a api
form2.addEventListener("submit", ()=>{
    const login = {
        user: user.value,
        password: password.value
    }
    fetch('/api/login',{
         method: "POST",
         body: JSON.stringify(login),
         headers: {
            "Content-Type": "application/json" 
         }
    }).then(res => res.json())
    .then(data =>{
        if(data.status == "error"){
            error.style.display = "block"
            error.innerText = data.error
        }else{
            window.location.replace("/");
        }
    })
})