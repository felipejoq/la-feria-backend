import {v4 as UUIDv4, validate} from "uuid";

export const getUUID = () => {
  return UUIDv4();
};

export const isUUID = (value) => {
  return validate(value);
}