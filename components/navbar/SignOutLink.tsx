'use client';
import { SignOutButton } from '@clerk/nextjs';
import { toast } from 'sonner';
import Link from 'next/link';
const SignOutLink = () => {
  const handleLogout = () => {
    toast('Logging Out...');
  };
  return (
    <SignOutButton>
      <Link href='/' className='w-full text-left' onClick={handleLogout}>
        Logout
      </Link>
    </SignOutButton>
  );
};
export default SignOutLink;
