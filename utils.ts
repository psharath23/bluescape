import mongoose from "mongoose";

export const getEnv = (key: string): any => {
  const v = process.env[key];
  if (!v) {
    throw `${key} not found in env`;
  } else {
    return v;
  }
};