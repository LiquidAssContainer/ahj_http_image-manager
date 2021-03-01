export default class Fetch {
  static url = 'https://ahj-http-image-manager-server.herokuapp.com';

  static async createRequest(params = '', responseType, options) {
    const response = await fetch(this.url + params, options);
    if (response.ok) {
      switch (responseType) {
        case 'text':
          return await response.text();
        case 'json':
          return await response.json();
      }
    }
    throw new Error(response.status);
  }

  static postImage(formdata) {
    return this.createRequest('/images', 'text', {
      method: 'POST',
      body: formdata,
    });
  }

  static getImageLinks() {
    return this.createRequest('/images', 'json', {
      method: 'GET',
    });
  }

  static deleteImage(filename) {
    return this.createRequest('/images/' + filename, 'json', {
      method: 'DELETE',
      body: filename,
    });
  }
}
