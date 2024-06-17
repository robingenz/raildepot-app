import {
  VehicleCategory,
  VehicleCondition,
  VehicleEpoch,
  VehicleGauge,
} from '../enums';

export interface Vehicle {
  id: string;
  additionalName: string | null;
  category: VehicleCategory | null;
  classNumber: number | null;
  company: string | null;
  digital: {
    decoderAddress: number | null;
    decoderName: string | null;
  };
  imageFileIds: string[] | null;
  inventoryNumber: string | null;
  model: {
    articleNumber: string | null;
    axles: {
      total: number | null;
      powered: number | null;
      tractioned: number | null;
    };
    epoch: VehicleEpoch | null;
    gauge: VehicleGauge | null;
    hasLight: boolean | null;
    hasOriginalBox: boolean | null;
    hasSmoke: boolean | null;
    hasSound: boolean | null;
    isLimited: boolean | null;
    length: number | null;
    manufacturer: string | null;
    serialNumber: string | null;
    weight: number | null;
  };
  name: string;
  note: string | null;
  purchase: {
    date: string | null;
    invoiceNumber: string | null;
    invoiceFileId: string | null;
    location: string | null;
    msrp: number | null;
    price: number | null;
  };
  quantity: number | null;
  serialNumber: number | null;
  storage: {
    storageLocation: string | null;
    installationLocation: string | null;
    condition: VehicleCondition | null;
  };
  type: string | null;
  uic: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string | null;
}
