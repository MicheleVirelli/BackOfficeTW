function logOut(){
    sessionStorage.removeItem('authToken')
    localStorage.removeItem('authToken')

    document.location.href="../../nauthHome.html"
}

function serializeFormJson(form) {
    return Array.from(form.querySelectorAll('input, select, textarea'))
        .filter(element => element.name)
        .reduce((json, element) => { json[element.name] = element.type === 'checkbox' ? element.checked : element.value; return json; }, {});
}

async function logIn(loginForm){
    const data = serializeFormJson(loginForm);

    const response = await api.employees.login(data);

    if (response.status == 200)
        config.setToken(response.headers.authorization, data.remember)
    document.location.href = "/html/authenticatedPage/authIndex.html"

}
