import {
  Model,
  Document,
  Schema,
  MongooseFuzzySearchingOptions
} from 'mongoose';
import { UpdateQuery } from 'mongoose';
import mongooFuzzySearching from 'mongoose-fuzzy-searching';

// fuzzy searching plugin block the custom `toJSON`.
// So we need to override it again...
export function fuzzySearch<T extends Record<string, unknown>>(
  schema: Schema<T>,
  pluginOptions: MongooseFuzzySearchingOptions<T>
): void {
  const customToJSON = schema.get('toJSON');

  schema.plugin(mongooFuzzySearching, pluginOptions);

  const pluginToJSON = schema.get('toJSON');

  schema.set('toJSON', {
    ...pluginToJSON,
    ...customToJSON,
    transform: (model, data) => {
      data = pluginToJSON.transform(model, data);

      if (customToJSON.transform) {
        return customToJSON.transform(model, data);
      }
    }
  });
}

// Update all pre-existing documents with ngrams
// https://github.com/VassilisPallas/mongoose-fuzzy-searching#update-all-pre-existing-documents-with-ngrams
export const updateFuzzy = async <T extends Document>(
  model: Model<T>,
  attrs: (keyof T)[]
): Promise<void> => {
  for await (const doc of await model.find()) {
    const obj = attrs.reduce(
      (acc, attr) => ({ ...acc, [attr]: doc[attr] }),
      {}
    );
    await model.findByIdAndUpdate(doc._id, obj);
  }
};

// Delete old ngrams from all documents
// https://github.com/VassilisPallas/mongoose-fuzzy-searching#delete-old-ngrams-from-all-documents
export const removeUnsedFuzzyElements = async <T extends Document>(
  model: Model<T>,
  attrs: (keyof T)[]
): Promise<void> => {
  for await (const doc of await model.find()) {
    const $unset = attrs.reduce(
      (acc, attr) => ({ ...acc, [`${attr}_fuzzy`]: 1 }),
      {}
    );
    await model.findByIdAndUpdate(doc._id, { $unset } as UpdateQuery<T>, {
      new: true,
      strict: false
    });
  }
};
