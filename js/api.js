
/* eslint-disable no-param-reassign */

async function request(params) {
	const headers = params.headers || { 'Content-Type': 'application/json' };
	headers.authorization = config.getToken();

	return axios({
		method: params.method || 'get',
		url: params.url,
		mode: params.mode || 'cors',
		headers,
		data: params.data,
		timeout: params.timeout,
	});
}

function mapToQueryString(obj) {
	return Object.keys(obj).map((key) => `${key}=${encodeURIComponent(obj[key])}`).join('&');
}

function paginatorNext(paginator, url) {
	const query = `limit=${paginator.limit}&page=${paginator.nextPage}`;

	return request({
		url: `${url}?${query}`,
		method: 'get',
	});
}

function paginatorPrev(paginator, url) {
	const query = `limit=${paginator.limit}&page=${paginator.prevPage}`;

	return request({
		url: `${url}?${query}`,
		method: 'get',
	});
}

function paginatorAt(paginator, page, url, query = {}) {
	const finshedQuery = `limit=${paginator.limit}&page=${page}&${mapToQueryString(query)}`;

	return request({
		url: `${url}?${finshedQuery}`,
		method: 'get',
	});
}

const api = {
	customers: {
		async get(query = { limit: config.paginatorLimit }) {
			if (!query.limit && query.limit !== 0) { query.limit = config.paginatorLimit; }

			return request({
				url: `${config.customersApiUrl}?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async getSingle(id, query = {}) {
			return request({
				url: `${config.customersApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async post(data) {
			// TODO se si aggiungono le immagini va messo multiplart form data
			return request({
				url: config.customersApiUrl,
				method: 'post',
				data,
			});
		},
		async deleteSingle(id, query = {}) {
			return request({
				url: `${config.customersApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'delete',
			});
		},
		async patchSingle(id, data, query = {}) {
			return request({
				url: `${config.customersApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'patch',
				data,
			});
		},
		async getRentals(id, query = {}) {
			if (!query.limit && query.limit !== 0) { query.limit = config.paginatorLimitRentals; }

			return request({
				url: `${config.customersApiUrl}/${id}/rentals?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async login(credentials) {
			return request({
				url: `${config.serverApiUrl}/authentication/customers/login`,
				method: 'post',
				data: credentials,
				timeout: config.loginTimeout,
			});
		},
		async paginatorNext(paginator) { return paginatorNext(paginator, config.customersApiUrl); },
		async paginatorPrev(paginator) { return paginatorPrev(paginator, config.customersApiUrl); },
		async paginatorAt(paginator, page, query = {}) { return paginatorAt(paginator, page, config.customersApiUrl, query); },
		async paginatorRentalAt(paginator, customerID, page, query = {}) { return paginatorAt(paginator, page, `${config.customersApiUrl}/${customerID}/rentals`, query); },

	},
	employees: {
		async get(query = { limit: config.paginatorLimit }) {
			if (!query.limit && query.limit !== 0) { query.limit = config.paginatorLimit; }

			return request({
				url: `${config.employeesApiUrl}?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async getSingle(id, query = {}) {
			return request({
				url: `${config.employeesApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async post(data) {
			// TODO se si aggiungono le immagini va messo multiplart form data
			return request({
				url: config.employeesApiUrl,
				method: 'post',
				data,
			});
		},
		async deleteSingle(id, query = {}) {
			return request({
				url: `${config.employeesApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'delete',
			});
		},
		async patchSingle(id, data, query = {}) {
			return request({
				url: `${config.employeesApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'patch',
				data,
			});
		},
		async getRentals(id, query = {}) {
			if (!query.limit && query.limit !== 0) { query.limit = config.paginatorLimitRentals; }

			return request({
				url: `${config.employeesApiUrl}/${id}/rentals?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async login(credentials) {
			return request({
				url: `${config.serverApiUrl}/authentication/employees/login`,
				method: 'post',
				data: credentials,
				timeout: config.loginTimeout,
			});
		},
		async paginatorNext(paginator) { return paginatorNext(paginator, config.employeesApiUrl); },
		async paginatorPrev(paginator) { return paginatorPrev(paginator, config.employeesApiUrl); },
		async paginatorAt(paginator, page, query = {}) { return paginatorAt(paginator, page, config.employeesApiUrl, query); },
	},
	rentals: {
		async get(query = { limit: config.paginatorLimit }) {
			if (!query.limit && query.limit !== 0) { query.limit = config.paginatorLimit; }

			return request({
				url: `${config.rentalsApiUrl}?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async getSingle(id, query = {}) {
			return request({
				url: `${config.rentalsApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async deleteSingle(id, query = {}) {
			return request({
				url: `${config.rentalsApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'delete',
			});
		},
		async patchSingle(id, data, query = {}) {
			return request({
				url: `${config.rentalsApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'patch',
				data,
			});
		},
		async getBill(id, query = {}) {
			return request({
				url: `${config.rentalsApiUrl}/${id}/bill?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async getUnit(id, query = {}) {
			return request({
				url: `${config.rentalsApiUrl}/${id}/unit?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async post(data) {
			// TODO se si aggiungono le immagini va messo multiplart form data
			return request({
				url: config.rentalsApiUrl,
				method: 'post',
				data,
			});
		},
		async paginatorNext(paginator) { return paginatorNext(paginator, config.rentalsApiUrl); },
		async paginatorPrev(paginator) { return paginatorPrev(paginator, config.rentalsApiUrl); },
	},
	products: {
		async get(query = { limit: config.paginatorLimit }) {
			if (!query.limit && query.limit !== 0) { query.limit = config.paginatorLimit; }

			return request({
				url: `${config.productsApiUrl}?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async getUnits(id, query = {}) {
			return request({
				url: `${config.productsApiUrl}/${id}/units?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async getSingle(id, query = {}) {
			return request({
				url: `${config.productsApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async post(data) {
			// TODO se si aggiungono le immagini va messo multiplart form data
			return request({
				url: config.productsApiUrl,
				method: 'post',
				data,
			});
		},
		async deleteSingle(id, query = {}) {
			return request({
				url: `${config.productsApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'delete',
			});
		},
		async patchSingle(id, data, query = {}) {
			return request({
				url: `${config.productsApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'patch',
				data,
			});
		},
		async available(id, query = {}) {
			return request({
				url: `${config.productsApiUrl}/${id}/available?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async priceEstimation(id, query = {}) {
			return request({
				url: `${config.productsApiUrl}/${id}/priceEstimation?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async paginatorNext(paginator) { return paginatorNext(paginator, config.productsApiUrl); },
		async paginatorPrev(paginator) { return paginatorPrev(paginator, config.productsApiUrl); },
		async paginatorAt(paginator, page) { return paginatorAt(paginator, page, config.productsApiUrl); },

	},
	units: {
		async get(query = { limit: config.paginatorLimit }) {
			if (!query.limit && query.limit !== 0) { query.limit = config.paginatorLimit; }

			return request({
				url: `${config.unitsApiUrl}?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async getSingle(id, query = {}) {
			return request({
				url: `${config.unitsApiUrl}/${id}?${mapToQueryString(query)}`,
				method: 'get',
			});
		},
		async post(data, idProduct) {
			// TODO se si aggiungono le immagini va messo multiplart form data
			return request({
				url: `${config.productsApiUrl}/${idProduct}/units/`,
				method: 'post',
				data,
			});
		},
	},
	authentication: {
		async verify() {
			return request({
				url: `${config.serverApiUrl}/authentication/verify`,
				method: 'get',
				timeout: config.loginTimeout,
			});
		},
	},
	localPagination: {
		async fromApi(getterFunction, params = [], query = {}) {
			query.limit = 0;
			const backendPaginator = (await getterFunction(...params, query)).data;

			// Non è detto che le api restituiscano sempre un paginator, quindi .docs non è sempre definito
			return new Paginator(backendPaginator.docs || backendPaginator, 8);
		},

		from(docs, limit) {
			return new Paginator(docs, limit);
		},
	},
	toServerUrl(url) {
		return `${config.serverUrl}/${url}`;
	},
	toServerApiUrl(url) {
		return `${config.serverApiUrl}/${url}`;
	},
	toServerImageUrl(url) {
		return `${config.serverUrl}/${url}`;
	},
};

// Sovrascrive la checkToken di base per usare le richieste delle api
config.checkToken = async function () {
	const token = config.getToken();
	console.log('Checking token:', token);

	if (!token) return false;

	try {
		await api.authentication.verify();
		return true;
	} catch (err) {
		return false;
	}
};
