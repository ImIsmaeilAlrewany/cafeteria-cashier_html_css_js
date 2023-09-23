// check if the online user/client is admin or not
const onlineClient = JSON.parse(sessionStorage.getItem('onlineClient'));
if (onlineClient.name !== 'admin') location.href = './index.html';