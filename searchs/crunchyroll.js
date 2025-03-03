function searchCrushroll(search, cookieHeader , token) {
    const url = 'https://www.crunchyroll.com/content/v2/discover/search?q=' + search + '&n=6&type=series,movie_listing&ratings=true&preferred_audio_language=pt-BR&locale=pt-BR';
    
    fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'pt-BR,pt;q=0.9',
              'Cookie': cookieHeader,
              'referer': 'https://www.crunchyroll.com/pt-br/search?q=' + search,
              'authorization': 'Bearer ' + token
            }
        }).then(response => {
            if (!response.ok) {
              console.error('crunchyroll Erro:', "request");
              return false;
              
            }
  
            return response.json();
          }).then(data => {
            return formateDataCrushroll(data);
          }).catch(error => {
            console.error('crunchyroll Erro:', error);
            return false;
          });
}

function crushRoll(search) {
    chrome.cookies.getAll({ domain: '.crunchyroll.com' }, (cookies) => {
      if (!cookies || cookies.length === 0) {
        removeStream('crunchyroll');
        return;
      }
      const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
      getTokenCrushRoll(cookieHeader, search);
    });
}

function getTokenCrushRoll(cookieHeader, search)
{
    const url = 'https://www.crunchyroll.com/auth/v1/token';
    const deviceId = cookieHeader.match(/device_id=([^;]+)/)[1];

    fetch(url, {
        method: 'POST',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'pt-BR,pt;q=0.9',
              'Cookie': cookieHeader,
              'referer': 'https://www.crunchyroll.com/',
              'authorization': 'Basic bm9haWhkZXZtXzZpeWcwYThsMHE6',
              'content-type':'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                device_id: deviceId,
                device_type: 'Chrome on Linux',
                grant_type: 'etp_rt_cookie'
            })
        }).then(response => {
            if (!response.ok) {
              console.error('crunchyroll Erro:', "request");
              return false;
              
            }
  
            return response.json();
          }).then(data => {
            searchCrushroll(search, cookieHeader, data.access_token);
          }).catch(error => {
            console.error('crunchyroll Erro:', error);
            return false;
          });
}

function formateDataCrushroll(data) {
    const newData = [];
    data.data.forEach(entities => {
        entities.items.forEach(item => {
            let slug = item.linked_resource_key.split("cms:")[1] + '/' + item.slug_title;

            if(entities.type == 'movie_listing'){
                slug = slug.replace("movie_listings", "watch");
            }

            newData.push({
                type: 'CrunchyRoll ' + entities.type,
                name: item.title,
                img: item.images.poster_wide[0][2].source,
                link: 'https://www.crunchyroll.com' + slug
            });
        })   
    });

    insertResult(newData);
}