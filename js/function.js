//TODO: Funzione che fa la stessa cosa di nauthHome.html
async function logIn(loginForm) {
  const data = serializeFormJson(loginForm);

  const response = await api.employees.login(data);

  if (response.status == 200)
    config.setToken(response.headers.authorization, data.remember);
  document.location.href = "./html/authenticatedPage/authIndex.html";
}

function logOut() {
  sessionStorage.removeItem("authToken");
  localStorage.removeItem("authToken");

  document.location.href = "../../nauthHome.html";
}

async function checkToken() {
  const logged = await config.loggedIn()
  if (logged == false)
    document.location.href = "../../nauthHome.html"
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

function serializeFormsJson(form) {
  let json

  form.querySelectorAll("input, select, textarea").forEach(element => {
    json[element.id] = element.value
  });

  return json
}

//FUNZIONI per muoversi tra le page 
function customerPage(id) {
  localStorage.setItem("CustomerID", id);
  document.location.href = "customerPage.html";
}

function rentalPage(id) {
  localStorage.setItem("idRental", id);

  document.location.href = "../rentPages/rentalPage.html";
}

function productPage(id) {
  localStorage.removeItem('ProductID')
  localStorage.setItem("ProductID", id);
  document.location.href = "productPage.html";
}

//FUNZIONI per manipolare page
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

function refreshNavPage(array, arrayName, tableName, toPage) {
  console.log("Refreshing:" + tableName);
  $("#pagenav").children().remove();

  $("#pagenav").append(`
  <nav>
    <ul id="navlist" class="pagination justify-content-center">
    </ul>
  </nav>
  `);

  pageNum = 0;
  array.forEach((page) => {
    $("#navlist").append(`
    <li class="page-item"><a class="page-link" href="#" onclick="${tableName}(${arrayName},${pageNum},'${toPage}')">${pageNum + 1
      }</a></li>
    `);
    pageNum++;
  });
}

function refreshNauthTable(paginateArray, value, pageFunction) {
  let boolColor = true;

  $("#productlist").children().remove();

  $("#productlist").append(`
  <table id="nauthTable" class="table">
    <tr  class="${boolColor ? "td" : "tr"}">
      <td>Nome Prodotto</td>
      <td>Categoria</td>
      <td>Sottocategoria</td>
    </tr>
  </table>
  `);

  console.log("Refresh with " + value);
  console.log(paginateArray);

  paginateArray[value].forEach((product) => {
    boolColor = !boolColor;
    $("#nauthTable").append(`
      <tr class="clickable-row ${boolColor ? "td" : "tr"
      }" onclick="${pageFunction}('${product._id}')">
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.subcategory}</td>
      </tr>
    `);
  });
}

function refreshClientGrid(paginateArray, value) {
  $("#clientlist").children().remove();

  $("#clientlist").append(
    paginateArray[value].forEach((customer) => {
      $("#clientlist").append(`
    <div class="col-sm-3">
    <div class="card mb-5" onclick="customerPage('${customer._id}')">
    <img src="https://site202120.tw.cs.unibo.it/${customer.profilePicture}">
    <div class="card-title">${customer.lastname}, ${customer.firstname}</div> 
    <div class="card-text">Data di nascita: ${customer.dateOfBirth.slice(
        0,
        10
      )}</div>
    <div class="card-text">Indirizzo: ${customer.address.city}, ${customer.address.country
        }</div>
    </div>
    </div>
    `);
    })
  );
}

function filterBy(array, fields, value) {
  let filtered = [];
  value = value.trim().toLowerCase();

  array.forEach((element) => {
    if (element != undefined) {
      fields.forEach((field) => {
        if (element[field].trim().toLowerCase().includes(value))
          filtered.push(element);
      });
    }
  });

  return filtered;
}

//TODO: Fa schifo mettere uno switch
function filterByForRentals(array, field, value) {
  let filtered = [];
  value = value.trim().toLowerCase();
  console.log(field)

  if (field == 'unit') {
    array.forEach((element) => {
      if (element != undefined) {
        if (element.unit.name.trim().toLowerCase().includes(value))
          filtered.push(element);
      }
    });
  }
  else if (field == 'customer') {
    array.forEach((element) => {
      if (element != undefined) {
        if (element.customer.lastname.trim().toLowerCase().includes(value) || element.customer.firstname.trim().toLowerCase().includes(value))
          filtered.push(element);
      }
    });
  }
  else if (field == 'employee') {
    array.forEach((element) => {
      if (element != undefined && element.employee != undefined) {
        if (element.employee.lastname.trim().toLowerCase().includes(value) || element.employee.firstname.trim().toLowerCase().includes(value))
          filtered.push(element);
      }
    });
  }
  else {
    array.forEach((element) => {
      if (element != undefined) {
        if (element[field].trim().toLowerCase().includes(value))
          filtered.push(element);
      }
    });
  }

  return filtered;
}

