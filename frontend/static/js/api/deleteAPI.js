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
    console.log('Failed to delete account: ', error);
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
    console.log('Failed to delete friend: ', error);
  }
};
