import { model, Schema } from "mongoose";

const modelName = "Audit";

const schema = new Schema(
    {
        description: { type: "String", required: true, trim: true },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        admin: { type: "String" },
        activity_type: { type: "String" },
        name: { type: "String" },
        module: { type: "String" },
        ip_address: { type: "String" },
        status: { type: "String" }
    },
    { timestamps: true }
)

const Audit = model(modelName, schema, 'audits');

export default Audit;
