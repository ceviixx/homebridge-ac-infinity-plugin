import type { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import type { ACInfinityContollerHomebridgePlatform } from './platform.js';

import { getDeviceInfo } from './globalFunctions/getDeviceInfo.js';
import { convertPercentToNumberAndPercent } from './globalFunctions/convertPercentToNumberAndPercent.js';

export class FanPlatformAccessory {
  private service: Service;

  constructor(
    private readonly platform: ACInfinityContollerHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'AC Infinity')
      .setCharacteristic(this.platform.Characteristic.Model, 'Fan')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, '000000');

    if (accessory.context.device.CustomService) {
      // This is only required when using Custom Services and Characteristics not support by HomeKit
      this.service = this.accessory.getService(this.platform.CustomServices[accessory.context.device.CustomService]) ||
        this.accessory.addService(this.platform.CustomServices[accessory.context.device.CustomService]);
    } else {
      this.service = this.accessory.getService(this.platform.Service.Fanv2) || this.accessory.addService(this.platform.Service.Fanv2);
    }

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    this.service.getCharacteristic(this.platform.Characteristic.Active)
      .onSet(this.setOn.bind(this))
      .onGet(this.getOn.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.RotationSpeed)
      .onSet(this.setRotationSpeet.bind(this))
      .onGet(this.getRotationSpeet.bind(this));
  }

  async getOn(): Promise<CharacteristicValue> {
    const data = await getDeviceInfo(this.platform.appId, this.platform.devId, this.accessory.context.device.port);
    try {
      return data.speak > 0 ? true : false;
    } catch (error) {
      this.platform.log.error('Error', error);
      return false;
    }
  }

  async getRotationSpeet(): Promise<CharacteristicValue> {
    const data = await getDeviceInfo(this.platform.appId, this.platform.devId, this.accessory.context.device.port);
    try {
      return data.speak * 10.0;
    } catch (error) {
      this.platform.log.error('Error', error);
      return 0.0;
    }
  }

  async setOn(value: CharacteristicValue) {
    // implement your own code to turn your device on/off
    // this.exampleStates.On = value as boolean;
    this.platform.log.debug('Set on state for', this.accessory.displayName, '->', value);
  }

  async setRotationSpeet(value: CharacteristicValue) {
    const newValue = value as number;
    const { number, percent } = await convertPercentToNumberAndPercent(newValue);

    this.service.getCharacteristic(this.platform.Characteristic.RotationSpeed).updateValue(percent);
    this.service.getCharacteristic(this.platform.Characteristic.RotationSpeed).handleGetRequest();
    this.platform.log.debug('Set brightness for ', this.accessory.displayName, 'to -> ', number, percent);
  }

}
