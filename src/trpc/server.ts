import "server-only";
import { appRouter } from "@/server/routers/root";

export const api = appRouter.createCaller({});
