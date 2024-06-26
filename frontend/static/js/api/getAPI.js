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
    console.log('Failed to get registration: ', error);
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
    console.log('Failed to get room name: ', error);
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
    alert('Failed to load profile data: ', error);
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
    console.log('Failed to load friends data: ', error);
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
