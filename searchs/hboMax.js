function searchHboMax(search, page = 1) {
    chrome.cookies.getAll({ domain: '.max.com' }, (cookies) => {

        if (!cookies || cookies.length === 0) {
          removeStream('hbo');
          return;
        }
        const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const url = `https://default.any-latam.prd.api.max.com/cms/collections/158344247395429224747101541838487197414?include=default&decorators=viewingHistory,isFavorite,contentAction,badges&pf[query]=${search}&page[items.number]=${page}&page[items.size]=25`;
    
        fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'pt-BR,pt;q=0.9',
              'Cookie': cookieHeader,
              'referer': 'https://www.max.com'
            }
        }).then(response => {
            if (!response.ok) {
              console.error('max Erro:', "request");
              return false;
              
            }
  
            return response.json();
          }).then(data => {
            formateDataHboMax(data, search, page)
          }).catch(error => {
            console.error('max Erro:', error);
            return false;
          });

    });
}

function nextPageHboMax(query, page) {
    localStorage.setItem('hbo-max-pagination', JSON.stringify([{
        next:page+1,
        query:query
    }]));
}

function formateDataHboMax(data, search,page) {
    const typeIndex = [];
    const result = [];
    let index = 0;

    data.included.forEach(item => {
        index = typeIndex.indexOf(item.type);

        if (index === -1) { 
            
            typeIndex.push(item.type);
            result.push([item]);

        } else {
            result[index].push(item);
        }
    });

    getSeason(result, typeIndex);
    nextPageHboMax(search, page)
}

function getSeason(data, indexs) {
    const coverArtworkHorizontal = data[indexs.indexOf('image')]
        .filter(item => item.attributes.kind === 'cover-artwork-horizontal');

    const newData = data[indexs.indexOf('show')].map(item => {
        const img = item.relationships.images.data
            .map(image => getImage(image.id, coverArtworkHorizontal))
            .find(image => image); 

        return {
            type: `HBO MAX`,
            name: item.attributes.name,
            img: img || '', 
            link: `https://play.max.com/show/${item.attributes.alternateId}`
        };
    });
    
    insertResult(newData);
}

function getImage(id, images) {
    const foundImage = images.find(image => image.id === id);
    return foundImage ? foundImage.attributes.src : false;
}
