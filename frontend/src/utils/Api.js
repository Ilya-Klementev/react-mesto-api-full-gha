import { adressServer } from "./utils.js";

class Api {
  constructor( { adressServer } ) {
    this._adressServer = adressServer;
    this._token = localStorage.getItem('jwt');
    this._headers = { 
      Authorization: this._token,
      "Content-Type": "application/json",
    };
  }

  _handleResponse = (res) => {
    if (res.ok) {
        return res.json();
    }   return Promise.reject(`Ошибка: ${ res.status }`);
  }
 
  _request(endPoint, options) {
    return fetch(`${ this._adressServer }${ endPoint }`, options)
    .then(this._handleResponse);
  } 

  getInitialCards() { 
    return this._request(`/cards`, { headers: this._headers, credentials: "include", })};

  getUserInfo() {
    return this._request(`/users/me`, { headers: this._headers, credentials: "include" })};

  patchUserInfo({ name, about }) {
    return this._request(`/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    });
  }

  patchAvatar(avatar) {
    return this._request(`/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      credentials: "include",
      body: JSON.stringify( {avatar} )
     })
  }

  postCard({ place, link }) {
      return this._request(`/cards`, {
      method: "POST",
      headers: this._headers,
      credentials: "include",
      body: JSON.stringify({name: place, link:link }),
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
      credentials: "include"
    });
  }

  changelikeCard(cardId, isLiked) {
    return !isLiked ? this.dislikeCard(cardId) : this.likeCard(cardId);
  }
  
  likeCard(cardId){
    return this._request(`/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
      credentials: "include"
    });
  } 
 
  dislikeCard (cardId){
    return this._request(`/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
      credentials: "include"
    });
  }  
 
}   

const api = new Api({ adressServer });
export { api }