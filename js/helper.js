function serializeFormJson(form) {
    return Array.from(form.querySelectorAll('input, select, textarea'))
      .filter(element => element.name)
      .reduce((json, element) => { json[element.name] = element.type === 'checkbox' ? element.checked : element.value; return json; }, {});
  }

  $('#loginsubmit').click(async function (event) {
    event.preventDefault()

    const data = serializeFormJson(loginForm);

    const response = await api.employees.login(data);

    if (response.status == 200)
      config.setToken(response.headers.authorization, data.remember)
    console.log(config.getToken())
    //1) inidirizzo di base 
    //2) solo server side 
    document.location.href = "/html/authenticatedPage/authIndex.html"
  });
