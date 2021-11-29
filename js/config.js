const config = {
	serverUrl: 'https://site202120.tw.cs.unibo.it',
	get serverApiUrl() { return `${this.serverUrl}/api`; }, 			// https://site202120.tw.cs.unibo.it/api    'http://localhost:3000/api'
	get serverImageUrl() { return `${this.serverUrl}/image`; },
	get employeesApiUrl() { return `${this.serverApiUrl}/employees`; },
	get customersApiUrl() { return `${this.serverApiUrl}/customers`; },
	get rentalsApiUrl() { return `${this.serverApiUrl}/rentals`; },
	get productsApiUrl() { return `${this.serverApiUrl}/products`; },
	token: 'armrp6OnNrjqYqe4WG0cta6pkOoGf1x/VekMnTNWP2vbhwfJsC68yYuWOoYSm4ijQm65zbq7Iafgcs5YeA4OBLQzqMjWqWWKkRWam2IHVUWC4M01w+ZsP6mzU0EdGviKEUAX99NoDv4S4DJXvMO6LfUQ0bWl24X/50eq3+OaJvr0ENPagpDmflUq4VwWyWx3Yuuvr37hLXPyZEDKzWNougQ3esR5CTlGuKF5jT3lrJv5R147de2gWql9kok0/Udt1upfLnh4N2GWaS+TjFWQUhXKLCciExfdsZrOSk/S4gEAYizsl1N1S6loZfJlt5IrfW+DE6Ojn0sLp3MMknr8tg==', 		// TODO deve essere undefined, per test metto la masterkey del server
	loginTimeout: 5000,
	get paginatorLimit() { return 5; },
	setToken(token) {
		this.token = token;
	},
};
