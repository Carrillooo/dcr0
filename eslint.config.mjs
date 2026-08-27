import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local visual-verification harness, not shipped.
    "tools/**",
  ]),

  {
    /* -----------------------------------------------------------------------
     * The WebGL layer.
     *
     * React Compiler's `immutability` and `refs` rules model every function in
     * a component as running during render. React Three Fiber's `useFrame`
     * callback does not: it runs on the render loop, after commit, up to 120
     * times a second, and the ONLY correct way to animate there is to mutate
     * object3D transforms, material uniforms and refs in place. Routing that
     * through React state would re-render the whole tree every frame and drop
     * the site to single-digit FPS — it is the single most common performance
     * mistake in R3F code.
     *
     * So these two rules are off for the canvas directory only. Everything
     * else in the app — including every rule about effects, dependencies and
     * hook ordering — stays on, here included.
     * -------------------------------------------------------------------- */
    files: ["src/components/canvas/**/*.tsx", "src/components/canvas/**/*.ts"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
