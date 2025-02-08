import type { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import type { ACInfinityContollerHomebridgePlatform } from './platform.js';

import { getTemperature } from './globalFunctions/getTemperature.js';

export class TemperaturePlatformAccessory {
  private service: Service;

  constructor(
    private readonly platform: ACInfinityContollerHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'AC Infinity')
      .setCharacteristic(this.platform.Characteristic.Model, 'Temperatur sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, '000000');

    if (accessory.context.device.CustomService) {
      this.service = this.accessory.getService(this.platform.CustomServices[accessory.context.device.CustomService]) ||
        this.accessory.addService(this.platform.CustomServices[accessory.context.device.CustomService]);
    } else {
      this.service = this.accessory.getService(this.platform.Service.TemperatureSensor) || this.accessory.addService(this.platform.Service.TemperatureSensor);
    }

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    this.service.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .onGet(this.handleCurrentTemperatureGet.bind(this));
  }

  async handleCurrentTemperatureGet(): Promise<CharacteristicValue> {
    const temperature = getTemperature(this.platform.appId);
    return temperature;
  }

}