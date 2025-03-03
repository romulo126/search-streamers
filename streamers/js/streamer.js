function getStreamer() 
{
  const streamers = JSON.parse(localStorage.getItem('streamers')) || [];
  const container = document.querySelector('.profiles-container');
  container.innerHTML = '';
  insertInfo();
  clearDataResult();
  
  streamers.forEach(streamer => {
    const profileDiv = document.createElement('div');
    profileDiv.classList.add('profile');
    profileDiv.id = streamer.index;

    const avatarDiv = document.createElement('div');
    const avatarImg = document.createElement('img');
    avatarDiv.classList.add('avatar');

    avatarImg.src = streamer.icon;
    avatarImg.classList.add('avatar');
    avatarDiv.appendChild(avatarImg);

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('profile-name');
    nameSpan.textContent = streamer.name;

    const removeBtn = document.createElement('div');
    removeBtn.classList.add('remove-btn');
    removeBtn.textContent = 'x';

    profileDiv.appendChild(avatarDiv);
    profileDiv.appendChild(nameSpan);
    profileDiv.appendChild(removeBtn);

    removeBtn.addEventListener('click', (event) => {
      removeStream(streamer.index);
    });

    container.appendChild(profileDiv);
  });

  insertDivAddStreamer();
}

function insertInfo() {
  const newStreamerDiv = document.createElement('div');
  newStreamerDiv.classList.add('profile');

  const avatarDiv = document.createElement('div');
  avatarDiv.classList.add('avatar');
  const avatarImg = document.createElement('img');
  avatarImg.src = '/streamers/img/info.png';
  avatarImg.classList.add('avatar');
  avatarDiv.appendChild(avatarImg);

  const nameSpan = document.createElement('span');
  nameSpan.classList.add('profile-name');
  nameSpan.textContent = 'INFO';

  newStreamerDiv.appendChild(avatarDiv);
  newStreamerDiv.appendChild(nameSpan);

  const container = document.querySelector('.profiles-container');

  newStreamerDiv.addEventListener('click', () => {
    window.location.href = "/streamers/html/info.html";
  });

  container.appendChild(newStreamerDiv);
}

function insertDivAddStreamer() {
    const newStreamerDiv = document.createElement('div');
    newStreamerDiv.classList.add('profile');

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('avatar');
    avatarDiv.textContent = '+';

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('profile-name');
    nameSpan.textContent = 'Adicionar';

    newStreamerDiv.appendChild(avatarDiv);
    newStreamerDiv.appendChild(nameSpan);

    const container = document.querySelector('.profiles-container');

    newStreamerDiv.addEventListener('click', () => {
      window.location.href = "/streamers/html/add.html";
    });

    container.appendChild(newStreamerDiv);
}

function removeStream(index) {
  const streamers = JSON.parse(localStorage.getItem('streamers')) || [];
  const newStreamer = [];

  streamers.forEach(streamer => {
    if (streamer.index != index) {
      newStreamer.push(streamer);
    }
  });

  localStorage.setItem('streamers', JSON.stringify(newStreamer));
  getStreamer();
}

window.addEventListener('DOMContentLoaded', getStreamer);