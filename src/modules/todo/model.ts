import { PaginateModel, Schema, model } from "mongoose";
import paginator from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { ITask } from "../../shared/interfaces";
import { generateID } from "../../shared/utils/generate-id";

const modelName = "Task";

const schema = new Schema(
    {
        _id: generateID(modelName),
        name: { type: "String", required: true, unique: true, trim: true },
        description: { type: "String", required: true, trim: true },
        start_date: { type: "Date", required: true },
        end_date: { type: "Date", required: true },
        avatar: { type: "String" },
        status: { type: "String" },
        date_deleted: { type: "Date", default: null },
        is_completed: { type: "Boolean", default: false },
        is_deleted: { type: "Boolean", default: false },
    },
    { timestamps: true, toJSON: { virtuals: true } }
)

schema.plugin(paginator);
schema.plugin(mongooseAggregatePaginate);

// create the paginated model
const Task = model<ITask, PaginateModel<ITask>>(modelName, schema, 'tasks');

export default Task