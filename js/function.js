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

async function checkAuthorization() {
  let auth = (await config.user()).authorization
  if(auth == 'admin')
    $.get('../templates/authNav.html', (data) => {
      $('body').append(data)
    })
  else
  $.get('../templates/authEmployeeNav.html', (data) => {
    $('body').append(data)
  })
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

function rentalManagementPage(id) {
  localStorage.setItem("RentalID", id);
  document.location.href = "./rentalManagement.html";
}

function productPage(id) {
  localStorage.setItem("ProductID", id);
  document.location.href = "productPage.html";
}

function billPage(id) {
  localStorage.setItem("BillID", id);
  document.location.href = "../billPages/billPage.html";
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

function refreshNavPage(array, arrayName, tableName, toPage, whatDisplay) {
  $("#pagenav").children().remove();

  $("#pagenav").append(`
  <nav>
    <ul id="navlist" class="pagination justify-content-center">
    </ul>
  </nav>
  `);

  pageNum = 0;
  array.forEach((page) => {
    if(page.length == 0)
      $("#navlist").append(``)
    else
      $("#navlist").append(`
      <li class="page-item"><a class="page-link" href="#" onclick="${tableName}(${arrayName},${pageNum},'${whatDisplay}')">${pageNum + 1
        }</a></li>
      `);
    pageNum++;
  });
}

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
            <div class="card-text">Autorizzazione: ${employee.authorization}</div>
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

function filterByForRentals(array, field, value) {
  let filtered = [];
  value = value.trim().toLowerCase();

  switch (field) {
    case 'product':
      array.forEach((element) => {
        if (element != undefined) {
          if (element.unit.name.trim().toLowerCase().includes(value))
            filtered.push(element);
        }
      });
      break;
    case 'customer':
      array.forEach((element) => {
        if (element != undefined) {
          if (element.customer.lastname.trim().toLowerCase().includes(value) || element.customer.firstname.trim().toLowerCase().includes(value))
            filtered.push(element);
        }
      });
      break;
    case 'employee':
      array.forEach((element) => {
        if (element != undefined && element.employee != undefined) {
          if (element.employee.lastname.trim().toLowerCase().includes(value) || element.employee.firstname.trim().toLowerCase().includes(value))
            filtered.push(element);
        }
      });
      break;
          
    case 'unit':
      array.forEach((element) => {
        if (element != undefined) {
          if (element.unit._id.trim().toLowerCase().includes(value))
            filtered.push(element);
        }
      });
      break;
    default:
      array.forEach((element) => {
        if (element != undefined) {
          if (element[field].trim().toLowerCase().includes(value))
            filtered.push(element);
        }
      });
      break;
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
      return 'guasto'
      break;
    case 'major flaw':
      return 'abbastanza danneggiato'
      break;
    case 'minor flaw':
      return 'lievemente danneggiato'
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

  const bill = (await api.bills.post(data, query)).data

  rental.bill = bill._id
}

function dateToData(date) {
  let year = date.slice(0, 4)
  let day = date.slice(8, 10)
  const montName = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',]
  date = new Date(date)

  return day + ' ' + montName[date.getMonth()] + ' ' + year
}

async function worstConditionAcceptable(unit1, unit2) {
  unit1 = (await api.units.getSingle(unit1)).data
  unit2 = (await api.units.getSingle(unit2)).data

  if(unit1.condition == unit2.condition)
    return unit1

  if(unit2.condition == 'broken')
    return unit1

  switch (unit1.condition) {
    
    case 'minor flaw':
      return unit1
    
    case 'major flaw':
      if(unit2.condition == 'perfect')
        return unit1
      else
        return unit2
   
    case 'perfect':
        return unit2
   
    default:
      return unit2
  }

}

function getActualDate(tomorrow = false) {

  let date = new Date()
  if (tomorrow)
      date.setDate(date.getDate() + 1)

  let day = (date.getDate()).toString()
  let month = (date.getMonth() + 1).toString()
  let year = (date.getFullYear()).toString()

  if (day < 10)
      day = '0' + day
  if (month < 10)
      month = '0' + month

  return (year + '-' + month + '-' + day + 'T00:00:00.000Z')
}
const urlsite = "https://site202120.tw.cs.unibo.it/"