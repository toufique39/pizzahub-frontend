import { betterAuth, APIError } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

import { client, db } from "./mongodb";
import { createAuthMiddleware } from "better-auth/api";

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
    minPasswordLength: 6,
  maxPasswordLength: 128,
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
hooks: {
  before: createAuthMiddleware(async (ctx) => {
    if (ctx.path !== "/sign-up/email") {
      return;
    }

    const password = ctx.body?.password;
    const role = ctx.body?.role;

    // Password validation
    if (
      typeof password !== "string" ||
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password)
    ) {
      throw new APIError("BAD_REQUEST", {
        message:
          "Password must contain at least 6 characters, one uppercase and one lowercase letter.",
      });
    }

    // Public registration role validation
    if (
      role !== undefined &&
      !["customer", "vendor"].includes(role)
    ) {
      throw new APIError("BAD_REQUEST", {
        message: "Invalid account role.",
      });
    }
  }),
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