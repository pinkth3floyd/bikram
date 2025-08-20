import { UserButton } from "@clerk/nextjs";
// import { Button } from "../elements/Button";

export const ProfileButton = () => {
  return (
    <div className="">
    <UserButton appearance={{
      elements: {
        userButtonPopoverCard: "bg-white"

      }
    }}>
        {/* <UserProfile /> */}
      </UserButton>
    </div>
  );
};