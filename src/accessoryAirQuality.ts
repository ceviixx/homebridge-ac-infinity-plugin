import type { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import type { ACInfinityContollerHomebridgePlatform } from './platform.js';

import { getAirQualityVPD } from './globalFunctions/getAirQualityVPD.js';

export class AirQualityPlatformAccessory {
  private service: Service;

  constructor(
    private readonly platform: ACInfinityContollerHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'AC Infinity')
      .setCharacteristic(this.platform.Characteristic.Model, 'Air Quality')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, '000000');
    if (accessory.context.device.CustomService) {
      this.service = this.accessory.getService(this.platform.CustomServices[accessory.context.device.CustomService]) ||
        this.accessory.addService(this.platform.CustomServices[accessory.context.device.CustomService]);
    } else {
      this.service = this.accessory.getService(this.platform.Service.AirQualitySensor) || this.accessory.addService(this.platform.Service.AirQualitySensor);
    }

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    this.service.getCharacteristic(this.platform.Characteristic.AirQuality)
      .onGet(this.handleAirQualityGet.bind(this));
  }

  async handleAirQualityGet(): Promise<CharacteristicValue> {
    const vpdnums = await getAirQualityVPD(this.platform.appId);
    return vpdnums;
  }

}