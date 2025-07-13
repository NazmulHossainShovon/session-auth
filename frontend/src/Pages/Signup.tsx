import { useContext } from 'react';
import Input from '../Components/Input';
import { Button } from '../Components/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSignupMutation } from '../Hooks/userHook';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import { Box, LinearProgress } from '@mui/material';
import { z } from 'zod';
import FormErrorMessage from '../Components/FormErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';

import { uploadToS3 } from '../utils/uploadToS3';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters' }),
  image: z.any(),
});

type SignupFields = z.infer<typeof signupSchema>;

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFields>({
    resolver: zodResolver(signupSchema),
  });
  const { mutateAsync: signup, isPending } = useSignupMutation();
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();

  const formDataHandle: SubmitHandler<SignupFields> = async (
    data: SignupFields
  ) => {
    const imageFile = data.image[0];
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await uploadToS3(imageFile, data.name);
    }
    const res = await signup({
      name: data.name,
      email: data.email,
      password: data.password,
      image: imageUrl,
    });
    dispatch({ type: 'sign-in', payload: res.user });
    
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-5 pt-8 items-center">
      <h1>Signup</h1>
      <form
        onSubmit={handleSubmit(formDataHandle)}
        className="flex flex-col gap-3 items-center"
      >
        <Input register={() => register('name')} placeholder="Name" />
        {errors?.name?.message && (
          <FormErrorMessage message={errors.name.message} />
        )}
        <Input
          register={() => register('email')}
          type="email"
          placeholder="Email"
        />
        <Input
          register={() => register('password')}
          type="password"
          placeholder="Password"
        />
        {errors?.password?.message && (
          <FormErrorMessage message={errors.password.message} />
        )}
        <div className=" flex flex-col gap-1">
          <label htmlFor="image">Profile Image</label>
          <input id="image" {...register('image')} type="file" />
        </div>

        <Button>Signup</Button>
        {isPending && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        )}
      </form>
    </div>
  );
}
