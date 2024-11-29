import { z } from 'zod';

export const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  email: z.string().email('Invalid email format'),
  fullname: z.string().min(1, 'Full Name is required'),
});
