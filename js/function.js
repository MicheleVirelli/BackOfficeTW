//TODO: Funzione che fa la stessa cosa di nauthHome.html
async function logIn(loginForm) {
  const data = serializeFormJson(loginForm);

  const response = await api.employees.login(data);

  if (response.status == 200)
    config.setToken(response.headers.authorization, data.remember);
  document.location.href = "./html/rentalWarning/rentalWarnings.html";
}

function logOut() {
  sessionStorage.removeItem("authToken");
  localStorage.removeItem("authToken");

  document.location.href = "../../index.html";
}

async function checkToken() {
  const logged = await config.loggedIn()
  if (logged == false)
    document.location.href = "../../index.html"
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

function employeePage(id) {
  localStorage.setItem("EmployeeID", id);
  document.location.href = "employeePage.html";
}

function rentalPage(id) {
  localStorage.setItem("rentalID", id);

  document.location.href = "../rentPages/rentalPage.html";
}

function productPage(id) {
  localStorage.removeItem('ProductID')
  localStorage.setItem("ProductID", id);
  document.location.href = "productPage.html";
}

function billPage(id) {
  localStorage.removeItem('BillID')
  localStorage.setItem("BillID", id);
  document.location.href = "../billPages/billPage.html";
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

function refreshNavPage(array, arrayName, tableName, toPage, whatDisplay) {
  console.log("Refreshing: " + tableName + "with " + whatDisplay);
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
    <li class="page-item"><a class="page-link" href="#" onclick="${tableName}(${arrayName},${pageNum},'${whatDisplay}')">${pageNum + 1
      }</a></li>
    `);
    pageNum++;
  });
}

function refreshTable(paginateArray, value, pageFunction) {
  let boolColor = true;

  $("#productlist").children().remove();

  $("#productlist").append(`
  <table id="table" class="table">
    <tr class="row-header">
      <td>Nome Prodotto</td>
      <td>Categoria</td>
      <td>Sottocategoria</td>
      <td>Prezzo</td>
    </tr>
  </table>
  `);

  console.log("Refresh with " + value);
  console.log(paginateArray);

  paginateArray[value].forEach((product) => {
    boolColor = !boolColor;
    $("#table").append(`
      <tr class="clickable-row ${boolColor ? "row-one" : "row-two"}" onclick="${pageFunction}('${product._id}')">
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.subcategory}</td>
        <td>${priceFormat(product.price)} €</td>
      </tr>
    `);
  });
}

//Renderlo intercambiabile tra customer ed employee
function refreshClientGrid(paginateArray, value, card) {
  $("#list").children().remove();

  if(card == undefined)
    card = 'customer'

  switch (card) {
    case 'customer':
      $("#list").append(
        paginateArray[value].forEach((customer) => {
          $("#list").append(`
        <div class="col-sm-3">
          <div class="card mb-5 p-3">
            <img src="https://site202120.tw.cs.unibo.it/${customer.profilePicture}" alt="Immagine di profilo del utente">
            <div class="card-title">${customer.lastname}, ${customer.firstname}</div> 
            <div class="card-text">Data di nascita: ${customer.dateOfBirth.slice(0, 10)}</div>
            <div class="card-text mb-2">Indirizzo: ${customer.address.city}, ${customer.address.country}</div>
            <div class="card-btn"><button class="btn btn-search" onclick="customerPage('${customer._id}')">Pagina del utente</button></div>
          </div>
        </div>
        `);
        })
      );
      break;

    case 'employee':
      $("#list").append(
        paginateArray[value].forEach((employee) => {
          $("#list").append(`
        <div class="col-sm-3">
          <div class="card mb-5 p-3">
            <img src="https://site202120.tw.cs.unibo.it/${employee.profilePicture}" alt="Immagine di profilo dell impiegato">
            <div class="card-title">${employee.lastname}, ${employee.firstname}</div>
            <div class="card-text">${employee.authorization}</div>
            <div class="card-btn"><button class="btn btn-search" onclick="employeePage('${employee._id}')">Pagina dell'impiegato</button></div>
          </div>
        </div>
        `);
        })
      );
      break;

    default:
      break;
  }

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

  if (field == 'product') {
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
  else if (field == 'unit') {
    array.forEach((element) => {
      if (element != undefined) {
        if (element.unit._id.trim().toLowerCase().includes(value))
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

function priceFormat(number) {
  const formatter = new Intl.NumberFormat('en-US')
  return formatter.format(number)
}

function conditionToCondizione(condition) {
  switch (condition) {
    case 'broken':
      return 'Scassato'
      break;
    case 'major flaw':
      return 'abbastanza danneggiato'
      break;
    case 'minor flaw':
      return 'lievemente danneggiatto'
      break;
    case 'perfect':
      return 'perfetto'
      break;
    default:
      return
      break;
  }
}

async function postBill(rental, surchargePrice) {
  let data = {
    customer: rental.customer,
    employee: rental.employee,
    startRent: rental.startDate,
    endRent: rental.expectedEndDate,
    unit: rental.unit
  }

  let query = {
    repairDamageSurcharge: surchargePrice,
    expectedEndDate: rental.expectedEndDate
  }
  console.log(data)
  console.log(query)

  const bill = (await api.bills.post(data, query)).data
  console.log(bill)

  rental.bill = bill._id
}

function dateToData(date) {
  let year = date.slice(0, 4)
  let day = date.slice(8, 10)
  const montName = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',]
  date = new Date(date)

  return day + ' ' + montName[date.getMonth()] + ' ' + year
}