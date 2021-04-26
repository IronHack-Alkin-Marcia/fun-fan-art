/*
https://harvardartmuseums.org/collections/api
https://github.com/harvardartmuseums/api-docs

https://data.rijksmuseum.nl/object-metadata/api/
https://www.rijksmuseum.nl/api/nl/collection?key=[api-key]&involvedMaker=Rembrandt+van+Rijn


*/
require('dotenv').config();

const axios = require('axios');
const qs = require('qs');

class ArtApi {
  constructor() {
    this.baseURL = `https://www.rijksmuseum.nl/api/en/collection?key=${process.env.RIJKSKEY}`;
    this.singleURL = `https://www.rijksmuseum.nl/api/en/collection/###?key=${process.env.RIJKSKEY}`;
    this.doRequest = function (URL, options) {
      const optionStr = qs.stringify(options);

      return axios
        .get(URL + (options ? ['?', optionStr].join('') : ''))
        .then(
          function (res) {
            if (res.status >= 400) {
              console.error('Bad response from server');
            }

            return res;
          }.bind(this)
        )
        .then(function (json) {
          if (json.data) {
            if (json.data.artObjects) {
              let data = json.data.artObjects
                .filter((art) => art.hasImage && art.showImage)
                .map((art) => {
                  const {
                    objectNumber: id,
                    title,
                    principalOrFirstMaker: artist,
                    longTitle: smallDescription,
                    headerImage: {
                      url: img,
                      width: imgWidth,
                      height: imgHeight,
                    },
                  } = art;
                  return {
                    id,
                    title,
                    artist,
                    smallDescription,
                    img,
                    imgWidth,
                    imgHeight,
                  };
                });
              return data;
            } else if (json.data.artObject) {
              const {
                objectNumber: id,
                title,
                principalOrFirstMaker: artist,
                webImage: { url: img, width: imgWidth, height: imgHeight },
                dating: { sortingDate: year },
                label: { description, makerLine: smallDescription },
              } = json.data.artObject;

              return {
                id,
                title,
                artist,
                smallDescription,
                description,
                img,
                imgWidth,
                imgHeight,
                year,
              };
            } else {
              return null;
            }
          } else {
            return null;
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    };
  }
  getArt(id) {
    const URL = this.singleURL.replace('###', id);

    if (!id) {
      console.error('No beer ID provided.');
    }

    return this.doRequest(URL);
  }

  getRandom(id) {
    let URL;
    if (!id && process.env.COMP && process.env.COMP == 'local') {
      URL = `http://localhost:${process.env.PORT}/datasimu/tmpsingle0.json`;
    } else {
      if (!id) {
        id = 'SK-C-5';
      }
      URL = this.singleURL.replace('###', id);
    }

    return this.doRequest(URL);
  }
  getRandoms() {
    let URL;
    if (process.env.COMP && process.env.COMP == 'local') {
      let random = Math.floor(Math.random() * 2);
      console.log('random', random);
      URL = `http://localhost:${process.env.PORT}/datasimu/tmpfile${random}.json`;
    } else {
      URL = `${this.baseURL}&ps=20&p=0&involvedMaker=Rembrandt+van+Rijn`;
    }

    return this.doRequest(URL);
  }
}

/*

******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************


*/
class BaseArtApi {}
class HarvardApi extends BaseArtApi {}

class RikjsApi extends BaseArtApi {
  constructor() {
    this.baseURL = 'https://www.rijksmuseum.nl/api/en/collection?key=[api-key]';
    this.doRequest = function (URL, options) {
      //const optionStr = qs.stringify(options);

      return axios
        .get(URL + (options ? ['?', optionStr].join('') : ''))
        .then(
          function (res) {
            if (res.status >= 400) {
              console.error('Bad response from server');
            }

            return res.json();
          }.bind(this)
        )
        .then(function (json) {
          return json;
        })
        .catch(function (err) {
          console.error(err);
        });
    };
  }

  getArts(options) {
    const URL = `${this.baseURL}&xxxxxxxx`;

    return this.doRequest(URL, options);
  }

  getArt(id) {
    const URL = `${this.baseURL}&xxxxxxxx`;

    if (!id) {
      console.error('No beer ID provided.');
    }

    return this.doRequest(URL);
  }

  getRandom() {
    const URL = `${this.baseURL}&xxxxxxxx`;

    return this.doRequest(URL);
  }

  getRandoms() {
    const URL = `${this.baseURL}&involvedMaker=Rembrandt+van+Rijn`;

    return this.doRequest(URL);
  }
}

module.exports = ArtApi;
