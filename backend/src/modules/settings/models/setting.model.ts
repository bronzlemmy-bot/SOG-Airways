
import mongoose, {
  model,
  Schema,
  Types,
  type HydratedDocument,
  type Model,
} from "mongoose";

export const SETTING_CATEGORIES = [
  "general",
  "booking",
  "payment",
  "notification",
  "security",
  "operations",
] as const;

export type SettingCategory = (typeof SETTING_CATEGORIES)[number];

export interface ISetting {
  key: string;
  value: unknown;
  description?: string | null;
  category: SettingCategory;
  isPublic: boolean;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SettingDocument = HydratedDocument<ISetting>;

type SettingModelType = Model<ISetting>;

const settingSchema = new Schema<ISetting, SettingModelType>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 2,
      maxlength: 150,
      match: /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },
    category: {
      type: String,
      enum: SETTING_CATEGORIES,
      required: true,
      default: "general",
      index: true,
    },
    isPublic: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

settingSchema.index({ category: 1, key: 1 });
settingSchema.index({ isPublic: 1, category: 1 });

export const Setting =
  (mongoose.models.Setting as SettingModelType | undefined) ??
  model<ISetting, SettingModelType>("Setting", settingSchema);
