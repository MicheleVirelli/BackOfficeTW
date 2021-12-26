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

// TODO: aggiungere il nome della variabile passata
function refreshNavPage(array, arrayName) {
  $("#navlist").children().remove();
  pageNum = 0;
  array.forEach((page) => {
    $("#navlist").append(`
    <li class="page-item"><a class="page-link" href="#" onclick="refreshNauthTable(${arrayName},${pageNum})">${pageNum+1}</a></li>
    `);
    pageNum++;
  });
}

function productPage(id) {
  localStorage.removeItem('idProduct')
  localStorage.setItem("idProduct", id);
  document.location.href = "nauthProductPage.html";
}

function refreshNauthTable(paginateArray, value) {
  let boolColor = true

  $("#productlist").children().remove();

  $("#productlist").append(`
  <table id="nauthTable" class="table">
    <tr  class="${boolColor ? 'td' : 'tr'}">
      <td>Nome Prodotto</td>
      <td>Categoria</td>
      <td>Sottocategoria</td>
    </tr>
  </table>
  `);

  console.log("Refresh with " + value);
  console.log(paginateArray);

  paginateArray[value].forEach((product) => {
    boolColor = !boolColor
    $("#nauthTable").append(`
      <tr class="clickable-row ${boolColor ? 'td' : 'tr'}" onclick="productPage('${product._id}')">
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.subcategory}</td>
      </tr>
    `);
  });
}

function filterBy(array, field, value) {
  let filtered = []

  array.forEach(element => {
    if(element != undefined)
      if(element[field].includes(value))
        filtered.push(element)
  });

  return filtered
}