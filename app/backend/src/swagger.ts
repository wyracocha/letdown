import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

// Definimos los schemas directamente en definition.components.schemas
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Let Down API",
      version: "1.0.0",
      description: "Documentación de endpoints del backend para kioskos interactivos",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Media: {
          type: "object",
          properties: {
            _id: { type: "string" },
            url: { type: "string" },
            tags: { type: "string" },
          },
        },
        Deeplink: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            url: { type: "string" },
            date: { type: "string", format: "date-time" },
          },
        },
        Kiosko: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            address: { type: "string" },
            active: { type: "boolean" },
            date: { type: "string", format: "date-time" },
            medias: {
              type: "array",
              items: { $ref: "#/components/schemas/Media" },
            },
            deeplinks: {
              type: "array",
              items: { $ref: "#/components/schemas/Deeplink" },
            },
          },
          required: ["name", "address"],
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"], // comentarios Swagger para rutas
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger UI available at http://localhost:3000/api/docs");
};
