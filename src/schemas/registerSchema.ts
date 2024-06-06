import { z } from "zod";

const registerSchema = z.object({
  fullName: z.string(),
  username: z.string(),
  phone: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .max(12, "Password must be Only 6-12 Characters")
    .min(6, "Password must be Only 6-12 Characters"),
  avatar: z.instanceof(File),
});

export default registerSchema;
