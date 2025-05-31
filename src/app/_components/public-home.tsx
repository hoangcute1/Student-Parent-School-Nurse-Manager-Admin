"use client";

import Banner from "./banner";
import Feature from "./feature";
import Blog from "./blog";
import Resource from "./resource";
import Contact from "./contact";

export function PublicHomePage() {
  return (
    <>
      <Banner />
      <Feature />
      <Resource />
      <Blog />
      <Contact />
    </>
  );
}
