function search()
{
  const inputSearch = document.getElementById('input-search').value;
  clearDataResult();
  
  if (inputSearch.trim() == '') {
    return;
  }

  const streamers = JSON.parse(localStorage.getItem('streamers')) || [];
  const result = [];
  document.getElementById('result').innerHTML = '';
  toggleLoader(true);
    
  streamers.forEach(streamer => {
        if (streamer.functionSearchName && streamer.functionSearchName.trim() !== '') {
            const func = window[streamer.functionSearchName];
            if (typeof func === 'function') {
              data = func(inputSearch);
            } else {
              console.warn(`Função ${streamer.functionSearchName} não encontrada ou não é uma função.`);
            }
          }
    });
}
  
function toggleLoader(show)
{
  if (show) {
    document.getElementById('loader').style.display = 'block';
        
    return;
  }

  document.getElementById('loader').style.display = 'none';
  document.getElementById('carregar').style.display = 'block';
}

function next() {
  if (localStorage.getItem('prime-pagination')) {
    nextPagePrimeVideo();
  }

  if (localStorage.getItem('hbo-max-pagination')) {
    let data = JSON.parse(localStorage.getItem('hbo-max-pagination'))[0];
    searchHboMax(data.query, data.next)
  }
}

document.getElementById('next-page').addEventListener('click', next);
document.getElementById('btn-search').addEventListener('click', search);