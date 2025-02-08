export async function doLogin(username: string, password: string): Promise<string> {
  return fetch('http://www.acinfinityserver.com/api/user/appUserLogin?appEmail='+username+'&appPasswordl='+ password, {
    method: 'POST',
    headers: {
      'User-Agent': 'ACController/1.8.2 (com.acinfinity.humiture; build:489; iOS 16.5.1) Alamofire/5.4.4',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  })
    .then((response) => response.json()) // Parse the response in JSON
    .catch(err => {
      console.log('login():', err);
      throw err;
    })
    .then((response) => {
      try {
        return response.data.appId;;
      } catch (error) {
        console.log('login():', error);
        throw error;
      }
    })
    .catch(err => {
      console.log('login():', err);
      throw err;
    });
}
  