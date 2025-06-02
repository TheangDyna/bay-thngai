export const defaultSchemaOptions = {
  timestamps: true,
  toObject: {
    transform: (_doc: any, ret: any) => {
      delete ret.__v;
      return ret;
    }
  },
  toJSON: {
    transform: (_doc: any, ret: any) => {
      delete ret.__v;
      return ret;
    }
  }
};
