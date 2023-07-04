//captura os campos do formulário de cadastro e envia para a api
form.addEventListener("submit", ()=>{
    const register = {
        login: login.value,
        password: password.value,
        confirm_password: confirm_password.value
    }
    if(password.value !== confirm_password.value){
        error.style.display = "block"
        error.innerText = "Digite duas senhas idênticas"
    }else{
    fetch('/api/register',{
         method: "POST",
         body: JSON.stringify(register),
         headers: {
            "Content-Type": "application/json" 
         }
    }).then(res => res.json())
    .then(data =>{
        if(data.status == "error"){
            error.style.display = "block"
            success.style.display = "none"
            error.innerText = data.error
        }else{
            success.style.display = "block"
            error.style.display = "none"
            success.innerText = data.success
        }
    })}
})