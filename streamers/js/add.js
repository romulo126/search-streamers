function getAllStreamer() 
{
    return [
        { name: "HBO MAX", icon: "/streamers/img/max-h-w-l.svg", index: "hbo", functionSearchName:"searchHboMax"},
        { name: "Prime Videos", icon: "/streamers/img/primeVideo.png", index: "amazon", functionSearchName:"searchPrimeVideo"},
        { name: "Crunchyroll", icon: "/streamers/img/crunchyroll.png", index: "crunchyroll", functionSearchName:"crushRoll"},
    ];
}

function showStreamer() {
    const storedStreamers = JSON.parse(localStorage.getItem('streamers')) || [];
    const allStreamers = getAllStreamer();
    const newData = [];

    allStreamers.forEach(streamer => {
        const exists = storedStreamers.some(item => item.index === streamer.index);
        if (!exists) {
            newData.push(streamer);
        }
    });

    const container = document.querySelector('.profiles-container');

    newData.forEach(data => {
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile');
        profileDiv.id = data.index;

        const avatarDiv = document.createElement('div');
        const avatarImg = document.createElement('img');
        avatarDiv.classList.add('avatar');

        avatarImg.src = data.icon;
        avatarImg.classList.add('avatar');
        avatarDiv.appendChild(avatarImg);

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('profile-name');
        nameSpan.textContent = data.name;

        const addBtn = document.createElement('div');
        addBtn.classList.add('add-btn');
        addBtn.textContent = '+';

        profileDiv.appendChild(avatarDiv);
        profileDiv.appendChild(nameSpan);
        profileDiv.appendChild(addBtn); 

        profileDiv.addEventListener('click', (event) => {
            
            storedStreamers.push(data);
            localStorage.setItem('streamers', JSON.stringify(storedStreamers));
            document.getElementById(data.index).style.display = 'none';
        });

        container.appendChild(profileDiv);
    });

    insertDivReturn();
}

function insertDivReturn() {
    const newStreamerDiv = document.createElement('div');
    newStreamerDiv.classList.add('profile');

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('avatar');
    const avatarImg = document.createElement('img');
    avatarImg.src = '/streamers/img/return.png';
    avatarDiv.appendChild(avatarImg);

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('profile-name');
    nameSpan.textContent = 'Retornar';

    newStreamerDiv.appendChild(avatarDiv);
    newStreamerDiv.appendChild(nameSpan);

    const container = document.querySelector('.profiles-container');

    newStreamerDiv.addEventListener('click', () => {
      window.location.href = "/index.html";
    });

    container.appendChild(newStreamerDiv);
}

window.addEventListener('DOMContentLoaded', showStreamer);
