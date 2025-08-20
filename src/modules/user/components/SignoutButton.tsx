import { SignOutButton, UserButton } from "@clerk/nextjs";
import { Button } from "../../../app/core/ui/elements/Button";

export const SignoutButton = () => {
  return (
    <div className="flex justify-center items-center h-screen">

        <UserButton/>



    <SignOutButton>
      <Button className="bg-red-600 mt-2 m-4 p-4 rounded-md hover:bg-red-700 text-white border-0 min-w-[100px]">Sign Out</Button>
    </SignOutButton></div>
    
  );
};