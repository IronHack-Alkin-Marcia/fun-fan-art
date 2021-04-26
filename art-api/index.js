/*
https://harvardartmuseums.org/collections/api
https://github.com/harvardartmuseums/api-docs

https://data.rijksmuseum.nl/object-metadata/api/
https://www.rijksmuseum.nl/api/nl/collection?key=[api-key]&involvedMaker=Rembrandt+van+Rijn


*/
require('dotenv').config();

const axios = require('axios');
const qs = require('qs');

class BaseArtApi {
  constructor() {
    this.baseURL;
    this.singleURL;
  }
  getArt(id) {
    const URL = this.singleURL.replace('###', id);
    if (!id) {
      console.error('No Art ID provided.');
    }
    return this.doRequest(URL);
  }
}
class HarvardApi extends BaseArtApi {}

class RikjsApi extends BaseArtApi {
  constructor() {
    super();
    this.baseURL = `https://www.rijksmuseum.nl/api/en/collection?key=${process.env.RIJKSKEY}&imgonly=1&type=painting`;
    this.singleURL = `https://www.rijksmuseum.nl/api/en/collection/###?key=${process.env.RIJKSKEY}`;
    this.doRequest = function (URL, options) {
      const museumapi = 'rijksmuseum';
      const optionStr = qs.stringify(options);
      let fullURL = URL + (options ? ['&', optionStr].join('') : '');
      console.log('fullURL', fullURL);
      return axios
        .get(fullURL)
        .then(
          function (res) {
            if (res.status >= 400) {
              console.error('Bad response from server');
            }
            console.log();
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
                    objectNumber: artId,
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
                    artId,
                    title,
                    artist,
                    smallDescription,
                    img,
                    imgWidth,
                    imgHeight,
                    museumapi: museumapi,
                  };
                });
              return data;
            } else if (json.data.artObject) {
              const {
                objectNumber: artId,
                title,
                principalOrFirstMaker: artist,
                webImage: { url: img, width: imgWidth, height: imgHeight },
                dating: { sortingDate: year },
                label: { description, makerLine: smallDescription },
              } = json.data.artObject;

              return {
                artId,
                title,
                artist,
                smallDescription,
                description,
                img,
                imgWidth,
                imgHeight,
                year,
                museumapi: museumapi,
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
    let options;
    if (process.env.COMP && process.env.COMP == 'local') {
      let random = Math.floor(Math.random() * 5);
      console.log('random', random);
      URL = `http://localhost:${process.env.PORT}/datasimu/tmpfile${random}.json`;
    } else {
      URL = `${this.baseURL}`;
      let random = Math.floor(Math.random() * 210);
      console.log('random', random);
      options = { ps: 20, p: random };
    }

    return this.doRequest(URL, options);
  }
}

class ArtApi {
  constructor() {
    this.rijksmuseum = new RikjsApi();
    this.runapp = 'rijksmuseum';
  }
  getArt(id) {
    return this[this.runapp].getArt(id);
  }
  getRandom(id) {
    return this[this.runapp].getRandom(id);
  }
  getRandoms() {
    return this[this.runapp].getRandoms();
  }
  setMuseum(museum) {
    if (this[museum]) this.runapp = museum;
  }
  getMuseum() {
    return this.runapp;
  }
}

class AAAAAA extends BaseArtApi {
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
}

module.exports = ArtApi;
