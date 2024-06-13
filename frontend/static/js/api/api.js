export const getProfileData = async () => {
  try {
    const response = await fetch('http://localhost:8000/profile/information/', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer' + ' ' + localStorage.getItem('token'),
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
        'Authorization': 'Bearer' + ' ' + localStorage.getItem('token'),
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
        'Authorization': 'Bearer' + ' ' + localStorage.getItem('token'),
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
}

export const getSearchResultData = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/profile/search/?nickname=${userId}`, {
      headers: {
        'Authorization': 'Bearer' + ' ' + localStorage.getItem('token'),
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
        'Authorization': 'Bearer' + ' ' + localStorage.getItem('token'),
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
}

export const postAddFriend = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/profile/search/${userId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + ' ' + localStorage.getItem('token'),
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
        'Authorization': 'Bearer' + ' ' + localStorage.getItem('token'),
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
        'Authorization': 'Bearer' + ' ' + localStorage.getItem('token'),
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
        'Authorization': 'Bearer' + ' ' + localStorage.getItem('token'),
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
        'Authorization': 'Bearer' + ' ' + localStorage.getItem('token'),
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
