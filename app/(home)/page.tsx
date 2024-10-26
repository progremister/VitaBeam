"use client"

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleStart = () => {
    router.push('/start');
  };

  return (
    <div className="homepage w-full px-5 lg:w-4/6 mx-auto py-10 lg:py-28">
      <div className="left flex flex-col gap-6 lg:gap-12 text-center w-full mx-auto">
        <h1 className="text-4xl lg:text-6xl font-bold text-center leading-relaxed lg:leading-snug">
          VitaBeam
        </h1>
        <h2 className="text-2xl text-sky-500">Tailored Supplements, Smarter Gains!</h2>
        <p className="text-lg text-neutral-400 lg:px-24 mx-auto">
        Whether your goal is to build strength, lose weight, or improve your overallwell-being, our app will help you reach your goals with ease.        </p>
        <Link href={isSignedIn ? "/start" : "/sign-in"}>
          <Button className="rounded-full">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
