import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from 'zod'

const schema = z.object({
  name: z.string().min(4, { message: "Name must be atleast 4 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: "Password must be atleast 8 characters" }),
});

type FormData = z.infer<typeof schema>;

const useRegister = () => {
 
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

export default useRegister;
