import { PaginateModel, Schema, model } from "mongoose";
import paginator from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IUser } from "../../shared/interfaces";
import { generateID } from "../../shared/utils/generate-id";

const modelName = "User";

const schema = new Schema(
    {
        _id: generateID(modelName),
        first_name: { type: "String", required: true, trim: true },
        last_name: { type: "String", required: true, trim: true },
        username: { type: "String", required: true, trim: true, unique: true },
        email: { type: "String", required: true, unique: true, trim: true },
        password: { type: "String", required: true },
        phone: { type: "String", minLength: 11, maxLength: 15, unique: true },
        avatar: { type: "String" },
        status: { type: "String" },
        gender: { type: "String" },
        date_of_birth: { type: Date },
        last_login: { type: "Date", default: null },
        date_deleted: { type: "Date", default: null },
        date_joined: { type: "Date" },
        is_verified_email: { type: "Boolean", default: false },
        is_completed_onboarding_kyc: { type: "Boolean", default: false },
        is_deleted: { type: "Boolean", default: false },
        passwordRetryCount: { type: "Number", default: 3 },
        passwordRetryMinutes: { type: "Number", default: 15 },
        last_failed_attempt: { type: "Date" },
    },
    { timestamps: true, toJSON: { virtuals: true } }
)

schema.plugin(paginator);
schema.plugin(mongooseAggregatePaginate);

// create the paginated model
const User = model<IUser, PaginateModel<IUser>>(modelName, schema, 'users');

export default User