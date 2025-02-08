export async function getTemperature(appId: string): Promise<number> {
  return fetch('http://www.acinfinityserver.com/api/user/devInfoListAll?userId=' + appId, {
    method: 'POST',
    headers: {
      'User-Agent': 'ACController/1.8.2 (com.acinfinity.humiture; build:489; iOS 16.5.1) Alamofire/5.4.4',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'token': appId,
    },
  })
    .then((response) => response.json())
    .catch(err => {
      console.log('getTemperature():', err);
      throw err;
    })
    .then((response) => {
      try {
        const temp = response.data[0].deviceInfo.temperature as number;
        return temp / 100.0;
      } catch (error) {
        console.log('getTemperature():', error);
        throw error;
      }
    })
    .catch(err => {
      console.log('getTemperature():', err);
      throw err;
    });
}