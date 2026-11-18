import { betterAuth, APIError } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

import { client, db } from "./mongodb";

const baseURL =
  process.env.BETTER_AUTH_URL || "http://localhost:10000";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  appName: "PizzaHub",
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [baseURL],
  database: mongodbAdapter(db, {
    client,
  }),

  // Email and Password Authentication
  emailAndPassword: {
    enabled: true,
  },

  // Google OAuth
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {},

  // Custom User Fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer",
        input: true,
      },

      isBlocked: {
        type: "boolean",
        required: true,
        defaultValue: false,
        input: false,
      },

      businessName: {
        type: "string",
        required: false,
        input: false,
      },

      subscriptionPlan: {
        type: "string",
        required: true,
        defaultValue: "free",
        input: false,
      },

      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  // Secure Role Assignment
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role =
            typeof user.role === "string" ? user.role : "customer";

          if (!["customer", "vendor"].includes(role)) {
            throw new APIError("BAD_REQUEST", {
              message:
                "Only Customer and Vendor accounts can register publicly.",
            });
          }

          return {
            data: {
              ...user,
              role,
              isBlocked: false,
              subscriptionPlan: "free",
            },
          };
        },
      },

      // Prevent users from changing their own role
      update: {
        before: async (data, ctx) => {
          const currentUser = ctx?.context.session?.user;

          if (currentUser) {
            return {
              data: {
                ...data,
                role: currentUser.role,
              },
            };
          }

          return { data };
        },
      },
    },
  },

  // JWT Plugin
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          isBlocked: user.isBlocked,
        }),
      },
    }),
  ],
});