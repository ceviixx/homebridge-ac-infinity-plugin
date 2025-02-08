export async function getDevices(appId: string): Promise<ReturnStructure> {
  const devices: DeviceStructure[] = [];

  return fetch('http://www.acinfinityserver.com/api/user/devInfoListAll?userId=' + appId, {
    method: 'POST',
    headers: {
      'User-Agent': 'ACController/1.8.2 (com.acinfinity.humiture; build:489; iOS 16.5.1) Alamofire/5.4.4',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'token': appId,
    },
  })
    .then((response) => response.json()) // Parse the response in JSON
    .catch(err => {
      console.log('devices():', err);
      throw err;
    })
    .then((response) => {
      devices.push({ type: 'airqual', uniqueId: 'airQualitySense', displayName: 'Air Quality', port: 0, devId: '' });
      devices.push({ type: 'temp', uniqueId: 'temSense', displayName: 'Temperature', port: 0, devId: '' });
      devices.push({ type: 'hum', uniqueId: 'humSense', displayName: 'Humidity', port: 0, devId: '' });
     

      response.data.forEach((device: ResponseDeviceStructure) => {
        console.log(device.devId);

        device.deviceInfo.ports.forEach((element: ResponseDevicePortStructure) => {
          if (element.online === 1) {
            if (element.portResistance === 3300) {
              devices.push({ type: 'light', uniqueId: '' + element.port + '', displayName: element.portName, port: element.port, devId: '' });
            } else if(element.portResistance === 5100) {
              devices.push({ type: 'fan', uniqueId: '' + element.port + '', displayName: element.portName, port: element.port, devId: '' });
            } else if(element.portResistance === 10000) {
              devices.push({ type: 'fan', uniqueId: '' + element.port + '', displayName: element.portName, port: element.port, devId: '' });
            } else {
              console.log('Could not add device:', element);
            }
          }
        });
      });

      /*
      response.data[0].deviceInfo.ports.forEach((element: ResponseDevicePortStructure) => {
        if (element.online === 1) {
          if (element.speak === 7) {
            devices.push({ type: 'light', uniqueId: '' + element.port + '', displayName: element.portName, port: element.port, devId: '' });
          } else if(element.speak === 5 || element.speak === 4) {
            devices.push({ type: 'fan', uniqueId: '' + element.port + '', displayName: element.portName, port: element.port, devId: '' });
          } else {
            console.log('Could not add device:', element);
          }
        }
      });
      */
      return new ReturnStructure(response.data[0].devId, devices);
    })
    .catch(err => {
      console.log('devices():', err);
      throw err;
    });
}


export class ReturnStructure {
  public devId: string;
  public devices: DeviceStructure[];  

  constructor(devId: string, devices: DeviceStructure[]) {
    this.devId = devId;
    this.devices = devices;
  }
}


export class DeviceStructure {
  public type: string;
  public uniqueId: string;  
  public displayName: string;
  public port: number;
  public devId: string;
  
  constructor(type: string, uniqueId: string, displayName: string, port: number, devId: string) {
    this.type = type;
    this.uniqueId = uniqueId;
    this.displayName = displayName;
    this.port = port;
    this.devId = devId;
  }
}
  
export class ResponseDeviceStructure {
  public devId: string;
  public deviceInfo: DeviceInfoStructure;

  constructor(devId: string, deviceInfo: DeviceInfoStructure) {
    this.devId = devId;
    this.deviceInfo = deviceInfo;
  }
}

export class DeviceInfoStructure {
  public ports: ResponseDevicePortStructure[];

  constructor(ports: ResponseDevicePortStructure[]) {
    this.ports = ports;
  }
}

export class ResponseDevicePortStructure {
  public speak: number;
  public deviceType: string;
  public trend: number;
  public port: number;
  public curMode: number;
  public remainTime: number;
  public modeTye: number;
  public online: number;
  public portName: string;
  // < portAccess >
  public portResistance: number;
  public isOpenAutomation: number;
  public advUpdateTime: string;
  public loadType: number;
  public loadId: number;
  public loadState: number;
  public abnormalState: number;
  
  constructor (speak: number, deviceType: string, trend: number, port: number, curMode: number, 
    remainTime: number, modeTye: number, online: number, portName: string, portResistance: number, isOpenAutomation: 
    number, advUpdateTime: string, loadType: number, loadId: number, loadState: number, abnormalState: number) {
    this.speak = speak;
    this.deviceType = deviceType;
    this.trend = trend;
    this.port = port;
    this.curMode = curMode;
    this.remainTime = remainTime;
    this.modeTye = modeTye;
    this.online = online;
    this.portName = portName;
    this.portResistance = portResistance;
    this.isOpenAutomation = isOpenAutomation;
    this.advUpdateTime = advUpdateTime;
    this.loadType = loadType;
    this.loadId = loadId;
    this.loadState = loadState;
    this.abnormalState = abnormalState;
  }
}