/**
 * For getting and setting objects from localStorage and parsing them as
 * js objects to memory.
 */
import get from 'lodash/get';
import set from 'lodash/set';

export const getFromObject = (object: string) => (key: string): null | string => {
  const dataObjStr = localStorage.getItem(object);
  if (!dataObjStr) {
    return null;
  }
  const dataObj = JSON.parse(dataObjStr);
  return get(dataObj, key, null);
};

export const getObjectWithNestedJSON = (object: string): null | Record<string, unknown> => {
  const dataObjStr = localStorage.getItem(object);
  if (!dataObjStr) {
    return null;
  }
  try {
    const dataObj = JSON.parse(dataObjStr);
    Object.keys(dataObj).forEach((key) => {
      dataObj[key] = JSON.parse(dataObj[key]);
    });
    return dataObj;
  } catch (e) {
    console.error(`error with parsing data obj from storage: ${e}`);
    return null;
  }
};

export const getArrayWithNestedJSON = (object: string): any[] => {
  const dataObjStr = localStorage.getItem(object);
  if (!dataObjStr) {
    return [];
  }
  try {
    const dataObj = JSON.parse(dataObjStr);
    return dataObj.map((obj: string) => JSON.parse(obj));
  } catch (e) {
    console.error(`error with parsing data obj from storage: ${e}`);
    return [];
  }
};

export const setIntoObject = (object: string) => (key: string, value: string): void => {
  const dataObjStr = localStorage.getItem(object);
  if (!dataObjStr) {
    const obj = { [key]: value };
    localStorage.setItem(object, JSON.stringify(obj));
    return;
  }
  const dataObj = JSON.parse(dataObjStr);
  set(dataObj, key, value);
  localStorage.setItem(object, JSON.stringify(dataObj));
  return;
};

export const removeFromObject = (object: string) => (key: string): void => {
  const dataObjStr = localStorage.getItem(object);
  if (dataObjStr) {
    const dataObj = JSON.parse(dataObjStr);
    if (dataObj[key]) {
      delete dataObj[key];
      localStorage.setItem(object, JSON.stringify(dataObj));
    }
  }
};
