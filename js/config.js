/* eslint-disable no-underscore-dangle */

const config = {
	serverUrl: 'localhost:8000',//'https://site202120.tw.cs.unibo.it',
	get serverApiUrl() { return `${this.serverUrl}/api`; }, 			// https://site202120.tw.cs.unibo.it/api    'http://localhost:3000/api'
	get serverImageUrl() { return `${this.serverUrl}/image`; },
	get employeesApiUrl() { return `${this.serverApiUrl}/employees`; },
	get customersApiUrl() { return `${this.serverApiUrl}/customers`; },
	get rentalsApiUrl() { return `${this.serverApiUrl}/rentals`; },
	get productsApiUrl() { return `${this.serverApiUrl}/products`; },
	get unitsApiUrl() { return `${this.serverApiUrl}/units`; },
	get paginatorLimit() { return 5; },
	get paginatorLimitRentals() { return 4; },
	loginTimeout: 5000,

	// TOKEN AND AUTHENTICATION
	getToken() {
		try {
			// diamo priorità al token nel sessionStorage, perché supponiamo essere più aggiornato
			return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
		} catch (err) {
			console.error(err);
			return undefined;
		}
	},
	setToken(token, remember = true) {
		try {
			this._tokenChanged = true;
			if (remember) localStorage.setItem('authToken', token);
			else sessionStorage.setItem('authToken', token);
		} catch (err) {
			console.error(err);
		}
	},
	_loggedIn: false,
	_tokenChanged: true,
	async loggedIn() {
		if (this._tokenChanged) {
			console.log('token changed, checking new token...');
			this._loggedIn = await this.checkToken();
			this._tokenChanged = false;
		}

		console.log('Is logged in: ', this._loggedIn);
		return this._loggedIn;
	},
	logout() {
		this.setToken('', false);
		this.setToken('', true);
	},
	async checkToken() { throw new Error('checkToken must be overwritten before use'); },
};

// TODO toglierelo
// FOR TESTING ONLY
// const serverMasterKey = 'armrp6OnNrjqYqe4WG0cta6pkOoGf1x/VekMnTNWP2vbhwfJsC68yYuWOoYSm4ijQm65zbq7Iafgcs5YeA4OBLQzqMjWqWWKkRWam2IHVUWC4M01w+ZsP6mzU0EdGviKEUAX99NoDv4S4DJXvMO6LfUQ0bWl24X/50eq3+OaJvr0ENPagpDmflUq4VwWyWx3Yuuvr37hLXPyZEDKzWNougQ3esR5CTlGuKF5jT3lrJv5R147de2gWql9kok0/Udt1upfLnh4N2GWaS+TjFWQUhXKLCciExfdsZrOSk/S4gEAYizsl1N1S6loZfJlt5IrfW+DE6Ojn0sLp3MMknr8tg==';
// config.setToken(serverMasterKey);
