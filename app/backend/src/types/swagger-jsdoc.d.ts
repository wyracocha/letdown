declare module "swagger-jsdoc" {
    import type { Options } from "swagger-jsdoc";
    const swaggerJSDoc: (options: Options) => object;
    export default swaggerJSDoc;
  
    export interface Options {
      definition: object;
      apis: string[];
    }
  }
