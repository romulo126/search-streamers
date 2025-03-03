function searchPrimeVideo(search) {
    const url = 'https://www.primevideo.com/region/na/search/ref=atv_nb_sug?ie=UTF8&phrase=' + search + '&dvWebSPAClientVersion=1.0.103788.0'

    chrome.cookies.getAll({ domain: '.primevideo.com' }, (primeCookies) => {
        // Recupera os cookies de .amazon.com
        chrome.cookies.getAll({ domain: '.amazon.com' }, (amazonCookies) => {
          // Combina os cookies de ambos os domínios
          const cookies = [...primeCookies, ...amazonCookies];
          
          if (!cookies || cookies.length === 0) {
            removeStream('amazon');
            return;
          }
    
          // Constrói a string do cabeçalho Cookie
          const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
          
          fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Accept-Language': 'pt-BR,pt;q=0.9',
              'Cookie': cookieHeader,
              'referer': 'https://www.primevideo.com/region/na/search/ref=atv_nb_sug?ie=UTF8&phrase=' + search,
              'x-requested-with': 'WebSPA'
            }
          })
          .then(response => {
            if (!response.ok) {
              console.error('Prime video Erro:', "request");
              return false;
              
            }
  
            return response.json();
          })
          .then(data => {
            return formatePrimeVideo(data);
          })
          .catch(error => {
            console.error('Prime video Erro:', error);
            return false;
          });
        });
      });    
}

function nextPagePrimeVideo() {
  const tokens = JSON.parse(localStorage.getItem('prime-pagination'));
  
  if(! tokens) {
    return;
  }

  const url = `https://www.primevideo.com/api/paginateCollection?pageType=search&pageId=flex&collectionType=Container&paginationTargetId=${tokens[0].targetId}&serviceToken=${tokens[0].serviceToken}&startIndex=${tokens[0].index}&actionScheme=default&payloadScheme=default&decorationScheme=web-search-decoration-tournaments-v2&featureScheme=web-search-v4&dynamicFeatures=integration&dynamicFeatures=CLIENT_DECORATION_ENABLE_DAAPI&dynamicFeatures=ENABLE_DRAPER_CONTENT&dynamicFeatures=HorizontalPagination&dynamicFeatures=CleanSlate&dynamicFeatures=EpgContainerPagination&dynamicFeatures=ENABLE_GPCI&dynamicFeatures=SupportsImageTextLinkTextInStandardHero&dynamicFeatures=Remaster&dynamicFeatures=SupportsChannelWidget&dynamicFeatures=PromotionalBannerSupported&dynamicFeatures=RemoveFromContinueWatching&widgetScheme=web-explore-v16&variant=desktopWindows&journeyIngressContext=`;

  chrome.cookies.getAll({ domain: '.primevideo.com' }, (primeCookies) => {
    // Recupera os cookies de .amazon.com
    chrome.cookies.getAll({ domain: '.amazon.com' }, (amazonCookies) => {
      // Combina os cookies de ambos os domínios
      const cookies = [...primeCookies, ...amazonCookies];
      
      if (!cookies || cookies.length === 0) {
        removeStream('amazon');
        return;
      }

      // Constrói a string do cabeçalho Cookie
      const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
      
      fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'pt-BR,pt;q=0.9',
          'Cookie': cookieHeader,
          'referer': 'https://www.primevideo.com/region/na/search/ref=atv_nb_sug?ie=UTF8',
          'x-requested-with': 'WebSPA'
        }
      })
      .then(response => {
        if (!response.ok) {
          console.error('Prime video Erro:', "request");
          return false;
          
        }

        return response.json();
      })
      .then(data => {
        formatePrimeVideoNext(data);
      })
      .catch(error => {
        console.error('Prime video Erro:', error);
        return false;
      });
    });
  });   
}

function formatePrimeVideo(data) {
    const newData = [];
    data.page.forEach(page => {
        page.assembly.body.forEach(body => {
            body.props.search.containers.forEach(container => {
                container.entities.forEach(entitie => {
                    if (entitie.entitlementCues.glanceMessage.message == ''){
                        newData.push({
                            type: 'Prime Video',
                            name: entitie.displayTitle,
                            img: entitie.images.cover.url,
                            link: 'https://www.primevideo.com' + entitie.link.url,
                        });
                    }
                });
            });
        });
    });
    
    let containers = data.page[0].assembly.body[0].props.search.containers;

    insertPrimeDataPagination(containers[containers.length - 1]);
    insertResult(newData);
}

function formatePrimeVideoNext(data) {
  const newData = [];

  if(data.entities === 0) {
    localStorage.removeItem('prime-pagination');
    return;
  }

  data.entities.forEach(entitie => {
    if (entitie.entitlementCues.glanceMessage.message == ''){
        newData.push({
            type: 'Prime Video',
            name: entitie.displayTitle,
            img: entitie.images.cover.url,
            link: 'https://www.primevideo.com' + entitie.link.url,
        });
    } 
  });

  if(data.pagination) {
    insertPrimeDataPagination(data.pagination);
  } else {
    localStorage.removeItem('prime-pagination');
    localStorage.setItem('prime-pagination' , false);
  }

  insertResult(newData);
}

function insertPrimeDataPagination(container) {
  localStorage.removeItem('prime-pagination');
  localStorage.setItem('prime-pagination' , JSON.stringify([{
    serviceToken: container.paginationServiceToken || container.serviceToken,
    targetId: container.paginationTargetId || container.targetId,
    index: container.paginationStartIndex || container.startIndex
  }]));
}
