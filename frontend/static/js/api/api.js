export const getProfileData = async () => {
  try {
    const response = await fetch('http://localhost:8000/profile/information/');
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
    const response = await fetch('http://localhost:8000/profile/history/');
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
    const response = await fetch(`http://localhost:8000/profile/search?nickname=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Failed to load search result data: ', error);
  }
};

export const postAddFriend = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/profile/search/${userId}/`, {
      method: 'POST',
      headers: {
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
