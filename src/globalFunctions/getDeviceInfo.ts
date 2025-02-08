export async function getDeviceInfo(appId: string, devId: string, port: string): Promise<ResponseDevicePortStructure> {
  return fetch('http://www.acinfinityserver.com/api/dev/getdevModeSettingList?devId='+devId+'&port='+port, {
    method: 'POST',
    headers: {
      'User-Agent': 'ACController/1.8.2 (com.acinfinity.humiture; build:489; iOS 16.5.1) Alamofire/5.4.4',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'token': appId,
    },
  })
    .then((response) => response.json())
    .catch(err => {
      console.log('Error', err);
      throw err;
    })
    .then((response) => {
      return response.data as ResponseDevicePortStructure;
    })
    .catch(err => {
      console.log('Error', err);
      throw err;
    });
}
  
  
export class ResponseDevicePortStructure {
  public speak: number;
  // < deviceType >
  // public trend: number;
  public port: number;
  public curMode: number;
  // public remainTime: number;
  // public modeTye: number;
  // public online: number;
  public portName: string;
  // < portAccess >
  // public portResistance: number;
  // public isOpenAutomation: number;
  // public advUpdateTime: string;
  // public loadType: number;
  // public loadId: number;
  // public loadState: number;
  // public abnormalState: number;
  
  constructor(speak: number, port: number, curMode: number, portName: string) {
    this.speak = speak;
    this.port = port;
    this.curMode = curMode;
    this.portName = portName;
  }
}