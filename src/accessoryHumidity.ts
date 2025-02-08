import type { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import type { ACInfinityContollerHomebridgePlatform } from './platform.js';

import { getHumidity } from './globalFunctions/getHumidity.js';

export class HumidityPlatformAccessory {
  private service: Service;

  constructor(
    private readonly platform: ACInfinityContollerHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'AC Infinity')
      .setCharacteristic(this.platform.Characteristic.Model, 'Humidity sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, '000000');

    if (accessory.context.device.CustomService) {
      this.service = this.accessory.getService(this.platform.CustomServices[accessory.context.device.CustomService]) ||
        this.accessory.addService(this.platform.CustomServices[accessory.context.device.CustomService]);
    } else {
      this.service = this.accessory.getService(this.platform.Service.HumiditySensor) || this.accessory.addService(this.platform.Service.HumiditySensor);
    }

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    this.service.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .onGet(this.handleCurrentRelativeHumidityGet.bind(this));
  }

  async handleCurrentRelativeHumidityGet(): Promise<CharacteristicValue> {
    const humidity = await getHumidity(this.platform.appId);
    return humidity;
  }

}