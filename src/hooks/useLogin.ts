import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: "Password must be atleast 8 characters " }),
});

type FormData = z.infer<typeof schema>;

const useLogin = () => {
 
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
      resolver: zodResolver(schema),
     });


  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setError
  };
};

export default useLogin;
