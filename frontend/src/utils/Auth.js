import { addressAuth } from "./utils.js";

class Auth {
  constructor(addressAuth) {
    this.addressAuth = addressAuth;
    this._headers = {
      "Content-Type": "application/json",
    };
  } 

  _handleResponse = (response) => {
    return response.ok ? response.json() : Promise.reject(`Ошибка ${response.status}`);
  };

  registration({ email, password }) {
    return fetch(`${this.addressAuth}/signup`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        password,
        email
      }),
    }).then(this._handleResponse);
  }

  authorization({ email, password }) {
    return fetch(`${this.addressAuth}/signin`, {
      method: "POST",
      headers: this._headers,
      credentials: "include",
      body: JSON.stringify({
        password,
        email
      }),
    }).then(this._handleResponse);
  }

  getUser(jwt) {
    return fetch(`${this.addressAuth}/users/me`, {
      method: "GET",
      credentials: "include",
      headers: { ...this._headers, Authorization : `Bearer ${jwt}` },
    }).then(this._handleResponse);
  } 

  setHeadersAuth(tokenAuth) {
    return this._headers = { ...this._headers, Authorization: `Bearer ${tokenAuth}` };
  }
}  
 
const auth = new Auth(addressAuth);

export { auth };
