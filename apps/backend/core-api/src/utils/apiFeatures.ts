import { Query } from "mongoose";

interface QueryString {
  page?: string;
  search?: string;
  sort?: string;
  limit?: string;
  select?: string;
  [key: string]: any;
}

export class APIFeatures<T> {
  private query: Query<T[], T>;
  private queryString: QueryString;

  constructor(query: Query<T[], T>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  public filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "select", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    for (const [key, value] of Object.entries(queryObj)) {
      if (Array.isArray(value)) {
        queryObj[key] = {
          $in: value.map((v) => {
            if (v === "true") return true;
            if (v === "false") return false;
            return v;
          })
        };
      }

      if (value === "true" || value === "false") {
        queryObj[key] = value === "true";
      }

      if (!isNaN(Number(value))) {
        queryObj[key] = Number(value);
      }
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    if (Object.keys(queryObj).length > 0) {
      this.query = this.query.find(JSON.parse(queryStr));
    }

    return this;
  }

  public search(fields: string[]): this {
    const searchQuery = this.queryString.search;

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      const searchConditions = fields.map((field) => ({
        [field]: { $regex: searchRegex }
      }));

      this.query = this.query.find({ $or: searchConditions });
    }

    return this;
  }

  public sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  public select(): this {
    if (this.queryString.select) {
      const select = this.queryString.select.split(",").join(" ");
      this.query = this.query.select(select);
    } else {
      this.query;
    }

    return this;
  }

  public paginate(): this {
    const page = parseInt(this.queryString.page || "1", 10);
    const limit = parseInt(this.queryString.limit || "10", 10);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  public getQuery(): Query<T[], T> {
    return this.query;
  }
}

// import { Model, PipelineStage } from "mongoose";

// interface QueryString {
//   page?: string;
//   search?: string;
//   sort?: string;
//   limit?: string;
//   select?: string;
//   [key: string]: any;
// }

// export class APIFeatures<T> {
//   private model: Model<T>;
//   private queryString: QueryString;
//   private aggregationPipeline: PipelineStage[] = [];

//   constructor(model: Model<T>, queryString: QueryString) {
//     this.model = model;
//     this.queryString = queryString;
//   }

//   public filter(): this {
//     const queryObj = { ...this.queryString };
//     const excludedFields = ["page", "sort", "limit", "select", "search"];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     for (const [key, value] of Object.entries(queryObj)) {
//       if (Array.isArray(value)) {
//         queryObj[key] = {
//           $in: value.map((v) => {
//             if (v === "true") return true;
//             if (v === "false") return false;
//             return v;
//           })
//         };
//       }

//       if (value === "true" || value === "false") {
//         queryObj[key] = value === "true";
//       }

//       if (!isNaN(Number(value))) {
//         queryObj[key] = Number(value);
//       }
//     }

//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     if (Object.keys(queryObj).length > 0) {
//       this.aggregationPipeline.push({
//         $match: JSON.parse(queryStr)
//       });
//     }

//     return this;
//   }

//   public search(fields: string[]): this {
//     const searchQuery = this.queryString.search;

//     if (searchQuery) {
//       const searchRegex = new RegExp(searchQuery, "i");
//       const searchConditions = fields.map((field) => ({
//         [field]: { $regex: searchRegex }
//       }));

//       this.aggregationPipeline.push({
//         $match: { $or: searchConditions }
//       });
//     }

//     return this;
//   }

//   public sort(): this {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(",").join(" ");
//       this.aggregationPipeline.push({
//         $sort: sortBy.split(" ").reduce(
//           (acc, field) => {
//             acc[field.startsWith("-") ? field.substring(1) : field] =
//               field.startsWith("-") ? -1 : 1;
//             return acc;
//           },
//           {} as Record<string, 1 | -1>
//         )
//       });
//     } else {
//       this.aggregationPipeline.push({
//         $sort: { createdAt: -1 }
//       });
//     }

//     return this;
//   }

//   public select(): this {
//     if (this.queryString.select) {
//       const fields = this.queryString.select.split(",").join(" ");
//       this.aggregationPipeline.push({
//         $project: fields.split(" ").reduce(
//           (acc, field) => {
//             acc[field] = 1;
//             return acc;
//           },
//           {} as Record<string, 1>
//         )
//       });
//     } else {
//       this.aggregationPipeline.push({
//         $sort: { createdAt: -1 }
//       });
//     }

//     return this;
//   }

//   public paginate(): this {
//     const page = parseInt(this.queryString.page || "1", 10);
//     const limit = parseInt(this.queryString.limit || "10", 10);
//     const skip = (page - 1) * limit;

//     this.aggregationPipeline.push({ $skip: skip }, { $limit: limit });

//     return this;
//   }

//   public async execute(): Promise<{ total: number; documents: T[] }> {
//     const pipeline = [...this.aggregationPipeline];

//     const paginationStages = this.aggregationPipeline.filter(
//       (stage) => !("$skip" in stage || "$limit" in stage)
//     );

//     paginationStages.push({ $count: "count" });

//     pipeline.push({
//       $facet: {
//         documents: []
//       }
//     });

//     const [totalResult, paginatedResult] = await Promise.all([
//       this.model.aggregate(paginationStages).exec(),
//       this.model.aggregate(pipeline).exec()
//     ]);

//     const total = totalResult[0]?.count || 0;
//     const documents = paginatedResult[0]?.documents || [];

//     return { total, documents };
//   }
// }
