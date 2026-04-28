import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as taskDb from "@/server/db/tasks";
import { publicProcedure, router } from "@/server/trpc";

const tituloSchema = z
  .string()
  .trim()
  .min(1, { message: "Title is required." });

export const taskRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      return taskDb.listPaged(input.limit, input.cursor);
    }),

  create: publicProcedure
    .input(
      z.object({
        titulo: tituloSchema,
        descricao: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      return taskDb.createTask({
        titulo: input.titulo,
        descricao: input.descricao,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        titulo: tituloSchema,
        descricao: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const updated = taskDb.updateTask(input.id, {
        titulo: input.titulo,
        descricao: input.descricao,
      });
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not update: task not found.",
        });
      }
      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ input }) => {
      const ok = taskDb.deleteTask(input.id);
      if (!ok) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not delete: task not found.",
        });
      }
      return { ok: true as const };
    }),
});

export type TaskRouter = typeof taskRouter;
