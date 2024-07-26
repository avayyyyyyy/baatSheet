import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = ({ params: { id } }: { params: { id: string } }) => {
  auth().protect();
  return <div>{id}</div>;
};

export default page;
