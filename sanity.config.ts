import { defineConfig } from "sanity";
import {
  apiVersion,
  dataset,
  previewSecretId,
  projectId,
} from "lib/sanity.api";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { productionUrl } from "plugins/productionUrl";
import { deskTool } from "sanity/desk";
import { previewDocumentNode } from "plugins/previewPane";
import { visionTool } from "@sanity/vision";
import { pageStructure, singletonPlugin } from "plugins/settings";
import { schemaTypes } from "./schemas";
import homePage from "./schemas/singeltons/homePage";
import settings from "./schemas/singeltons/settings";

export const PREVIEWABLE_DOCUMENT_TYPES: string[] = [homePage.name];

export default defineConfig({
  basePath: "/studio",
  name: "default",
  title: "playground",

  projectId: "ql2a5cjl",
  dataset: "production",

  plugins: [
    deskTool({
      structure: pageStructure([homePage, settings]),
      // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
      defaultDocumentNode: previewDocumentNode({ apiVersion, previewSecretId }),
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([homePage.name, settings.name]),
    // Add the "Open preview" action
    productionUrl({
      apiVersion,
      previewSecretId,
      types: PREVIEWABLE_DOCUMENT_TYPES,
    }),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: schemaTypes,
  },
});
