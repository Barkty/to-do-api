import { PREFIXES } from "../enums";
import { Types } from "mongoose";

const { ObjectId } = Types;

type ModelName = keyof typeof PREFIXES;

export const generateID = (modelName: string): any => {
    const prefix = PREFIXES[modelName as ModelName];
    if (!prefix) throw new Error(`Prefix not defined for model: ${modelName}`);

    const duplicates = Object.keys(PREFIXES).filter((key) => key !== modelName && PREFIXES[key as ModelName] === prefix);
    if (duplicates.length > 0) throw new Error(`Duplicate ID prefix for ${duplicates.join(",")}`);

    return {
        type: String,
        required: true,
        default: function () {
            return `${prefix}_${new ObjectId().toHexString()}`;
        }
    };
};
