import { documentSchemas } from "./documents";
import { objectSchemas } from "./objects";
import { singeltonsSchemas } from "./singeltons";

export const schemaTypes = [
  ...documentSchemas,
  ...objectSchemas,
  ...singeltonsSchemas,
];
