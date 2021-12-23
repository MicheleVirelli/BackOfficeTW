function logOut() {
  sessionStorage.removeItem("authToken");
  localStorage.removeItem("authToken");

  document.location.href = "../../nauthHome.html";
}

function serializeFormJson(form) {
  return Array.from(form.querySelectorAll("input, select, textarea"))
    .filter((element) => element.name)
    .reduce((json, element) => {
      json[element.name] =
        element.type === "checkbox" ? element.checked : element.value;
      return json;
    }, {});
}

async function logIn(loginForm) {
  const data = serializeFormJson(loginForm);

  const response = await api.employees.login(data);

  if (response.status == 200)
    config.setToken(response.headers.authorization, data.remember);
  document.location.href = "/html/authenticatedPage/authIndex.html";
}

function paginator(elemForPage, array) {
  let i = [];
  let c = 1;
  let paginate = [];

  for (let element of array) {
    if (c % elemForPage == 0) {
      i.push(element);
      paginate.push(i);
      i = [];
    } else {
      i.push(element);
    }
    c++;
  }
  paginate.push(i);

  return paginate;
}

function refreshNavPage(array) {
  $("#navlist").children().remove();
  pageNum = 0;
  array.forEach((page) => {
    $("#navlist").append(`
    <li class="page-item"><a class="page-link" href="#" onclick="refreshTable(${pageNum},paginate)">${pageNum++}</a></li>
    `);
    pageNum++;
  });
}
