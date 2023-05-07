import AddFriendButton from "@/components/AddFriendButton";
import { FC } from "react";

const page = () => {
  return (
    <section>
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <AddFriendButton />
    </section>
  );
};

export default page;
