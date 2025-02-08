import type { API, Characteristic, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig, Service } from 'homebridge';

import { FanPlatformAccessory } from './accessoryFan.js';
import { TemperaturePlatformAccessory } from './accessoryTemperature.js';
import { HumidityPlatformAccessory } from './accessoryHumidity.js';
import { LightPlatformAccessory } from './accessoryLight.js';
import { AirQualityPlatformAccessory } from './accessoryAirQuality.js';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';

// This is only required when using Custom Services and Characteristics not support by HomeKit
import { EveHomeKitTypes } from 'homebridge-lib/EveHomeKitTypes';

import { doLogin } from './globalFunctions/doLogin.js';
import { getDevices } from './globalFunctions/getDevices.js';

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class ACInfinityContollerHomebridgePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service;
  public readonly Characteristic: typeof Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: Map<string, PlatformAccessory> = new Map();
  public readonly discoveredCacheUUIDs: string[] = [];

  // This is only required when using Custom Services and Characteristics not support by HomeKit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly CustomServices: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly CustomCharacteristics: any;

  public appId: string = '';
  public devId: string = '';

  constructor(
    public readonly log: Logging,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.Service = api.hap.Service;
    this.Characteristic = api.hap.Characteristic;

    // This is only required when using Custom Services and Characteristics not support by HomeKit
    this.CustomServices = new EveHomeKitTypes(this.api).Services;
    this.CustomCharacteristics = new EveHomeKitTypes(this.api).Characteristics;

    this.loginAndLoadDevices();
    
    this.log.debug('Finished initializing platform:', this.config.name);

    // When this event is fired it means Homebridge has restored all cached accessories from disk.
    // Dynamic Platform plugins should only register new accessories after this event was fired,
    // in order to ensure they weren't added to homebridge already. This event can also be used
    // to start discovery of new accessories.
    this.api.on('didFinishLaunching', () => {
      
      log.debug('Executed didFinishLaunching callback');
      // run the method to discover / register your devices as accessories
      // this.discoverDevices();
    });


    
  }

  /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to set up event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    // add the restored accessory to the accessories cache, so we can track if it has already been registered
    this.accessories.set(accessory.UUID, accessory);
  }


  discoverDevices(devices: DeviceStructure[]) {
    // loop over the discovered devices and register each one if it has not already been registered
    for (const device of devices) {
      const uuid = this.api.hap.uuid.generate(device.uniqueId);

      const existingAccessory = this.accessories.get(uuid);

      if (existingAccessory) {
        // the accessory already exists
        this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);

        if (device.type === 'fan') {
          new FanPlatformAccessory(this, existingAccessory);
        } else if (device.type === 'temp') {
          new TemperaturePlatformAccessory(this, existingAccessory);
        } else if (device.type === 'hum') {
          new HumidityPlatformAccessory(this, existingAccessory);
        } else if (device.type === 'light') {
          new LightPlatformAccessory(this, existingAccessory);
        } else if (device.type === 'airqual') {
          new AirQualityPlatformAccessory(this, existingAccessory);
        } else {
          this.log.error('Unknown device type:', device);
        }
        
        

        // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, e.g.:
        // remove platform accessories when no longer present
        // this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);
        // this.log.info('Removing existing accessory from cache:', existingAccessory.displayName);
      } else {
        // the accessory does not yet exist, so we need to create it
        this.log.info('Adding new accessory:', device.displayName);

        // create a new accessory
        const accessory = new this.api.platformAccessory(device.displayName, uuid);

        // store a copy of the device object in the `accessory.context`
        // the `context` property can be used to store any data about the accessory you may need
        accessory.context.device = device;

        // create the accessory handler for the newly create accessory
        // this is imported from `platformAccessory.ts`
        if (device.type === 'fan') {
          new FanPlatformAccessory(this, accessory);
        } else if (device.type === 'temp') {
          new TemperaturePlatformAccessory(this, accessory);
        } else if (device.type === 'hum') {
          new HumidityPlatformAccessory(this, accessory);
        } else if (device.type === 'light') {
          new LightPlatformAccessory(this, accessory);
        } else if (device.type === 'airqual') {
          new AirQualityPlatformAccessory(this, accessory);
        } else {
          this.log.error('Unknown device type:', device);
        }
        

        // link the accessory to your platform
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }

      // push into discoveredCacheUUIDs
      this.discoveredCacheUUIDs.push(uuid);
    }

    // you can also deal with accessories from the cache which are no longer present by removing them from Homebridge
    // for example, if your plugin logs into a cloud account to retrieve a device list, and a user has previously removed a device
    // from this cloud account, then this device will no longer be present in the device list but will still be in the Homebridge cache
    for (const [uuid, accessory] of this.accessories) {
      if (!this.discoveredCacheUUIDs.includes(uuid)) {
        this.log.info('Removing existing accessory from cache:', accessory.displayName);
        this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    }
  }

  async loginAndLoadDevices() {
    const appId = await doLogin(this.config.username, this.config.password);
    this.appId = appId;
    const data = await getDevices(this.appId);
    this.log.info('Loaded devices:', data.devices);
    this.devId = data.devId;
    this.discoverDevices(data.devices);
  }


}



 


export class DeviceStructure {
  public type: string;
  public uniqueId: string;  
  public displayName: string;
  public port: number;

  constructor(type: string, uniqueId: string, displayName: string, port: number) {
    this.type = type;
    this.uniqueId = uniqueId;
    this.displayName = displayName;
    this.port = port;
  }
}

export class ResponseDevicePortStructure {
  public speak: number;
  public deviceType: string;
  // public trend: number;
  public port: number;
  // public curMode: number;
  // public remainTime: number;
  // public modeTye: number;
  public online: number;
  public portName: string;
  // < portAccess >
  // public portResistance: number;
  // public isOpenAutomation: number;
  // public advUpdateTime: string;
  // public loadType: number;
  // public loadId: number;
  // public loadState: number;
  // public abnormalState: number;

  constructor(speak: number, deviceType: string, port: number, online: number, portName: string) {
    this.speak = speak;
    this.deviceType = deviceType;
    this.port = port;
    this.online = online;
    this.portName = portName;
  }
}