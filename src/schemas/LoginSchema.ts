import { z } from "zod";

const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(6, "Password Should be Minimum  characters"),
});
export default loginSchema;
