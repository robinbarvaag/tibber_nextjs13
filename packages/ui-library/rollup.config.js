import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import preserveDirectives from "rollup-plugin-preserve-directives";

const packageJson = require("./package.json"); // Assuming this is a JSON object and not a file path

const externalPackages = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
];

const regexOfExtPackages = externalPackages.map(
  (packageName) => new RegExp(`^${packageName}(\/.*)?`)
);

export default [
  {
    onwarn(warning, warn) {
      if (
        warning.code === "MODULE_LEVEL_DIRECTIVE" &&
        warning.message.includes(`'use client'`)
      ) {
        return;
      }
      warn(warning);
    },
    input: "src/index.ts",
    output: [
      {
        format: "es",
        sourcemap: true,
        dir: "dist",
        entryFileNames: "[name].mjs",
        preserveModules: true,
      },
      {
        format: "cjs",
        sourcemap: true,
        file: "dist/index.cjs",
      },
    ],
    plugins: [
      preserveDirectives({ supressPreserveModulesWarning: true }),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser({
        compress: {
          directives: false,
        },
      }),
    ],
    external: [...regexOfExtPackages],
  },
  {
    input: "dist/types/index.d.ts",
    output: { file: "dist/index.d.ts", format: "es" }, // Simplified output object
    plugins: [dts()],
    external: [/\.css$/], // telling rollup that .css files aren't part of type exports
  },
];
