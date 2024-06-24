export const getRegistration = async () => {
  try {
    const response = await fetch('http://localhost:8000/login/registration/', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('token'),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const postGameResult = async (gameMode, userInfo) => {
  try {
    let user1 = userInfo.player1.name;
    let user2 = userInfo.player2.name;
    let user1_score = userInfo.player1.score;
    let user2_score = userInfo.player2.score;
    const response = await fetch('http://localhost:8000/play/result/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
      },
      body: JSON.stringify({
        game_type: gameMode,
        user1: user1,
        user2: user2,
        user1_score: user1_score,
        user2_score: user2_score,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postLoginCode2FA = async (code) => {
  try {
    const response = await fetch('http://localhost:8000/login/two_fa/verify/', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verification_code: code }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    alert('Failed to get 2FA code: ', error);
    return null;
  }
};

export const postLogin2FA = async (email) => {
  try {
    const response = await fetch('http://localhost:8000/login/two_fa/request/', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    alert('Failed to get 2FA code: ', error);
    window.location.href = '/';
    console.log('Failed to get 2FA code: ', error);
  }
};

export const deleteAccount = async () => {
  try {
    const response = await fetch('http://localhost:8000/profile/withdrawal/', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getRoomName = async (mode) => {
  try {
    const response = await fetch(`http://localhost:8000/play/room/?mode=${mode}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Failed to load profile data: ', error);
  }
};

export const getProfileData = async () => {
  try {
    const response = await fetch('http://localhost:8000/profile/information/', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Failed to load profile data: ', error);
  }
};

export const getHistoryData = async () => {
  try {
    const response = await fetch('http://localhost:8000/profile/history/', {
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Failed to load history data: ', error);
  }
};

export const getFriendsData = async () => {
  try {
    const response = await fetch('http://localhost:8000/profile/friends/', {
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Failed to load history data: ', error);
  }
};

export const getSearchResultData = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/profile/search/?nickname=${userId}`, {
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Failed to load search result data: ', error);
  }
};

export const deleteFriend = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/profile/friends/${userId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postTournamentNickName = async (nickName, realName, roomName) => {
  try {
    const response = await fetch(`http://localhost:8000/play/nickname/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
      },
      body: JSON.stringify({ nickname: nickName, realname: realName, room_name: roomName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postAddFriend = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/profile/search/${userId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postLoginCode = async (code) => {
  try {
    const response = await fetch(`http://localhost:8000/login/oauth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
      },
      body: JSON.stringify({ code: code }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const patchStatusMessage = async (message) => {
  try {
    const response = await fetch('http://localhost:8000/profile/information/message/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
      },
      body: JSON.stringify({ status_msg: message }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const patchAvatar = async (imgId) => {
  try {
    const response = await fetch('http://localhost:8000/profile/information/photo/', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile_img: imgId }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const patchLanguage = async (lang) => {
  try {
    const response = await fetch('http://localhost:8000/profile/language/', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('2FA'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language: lang }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
