import { z } from "zod";

export const githubUsernameSchema = z
  .string()
  .trim()
  .min(1, "Informe um nome de usuário do GitHub.")
  .regex(
    /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/,
    "Nome de usuário inválido. Use apenas letras, números e hífens (sem espaços).",
  );

export const searchFormSchema = z.object({
  username: githubUsernameSchema,
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
