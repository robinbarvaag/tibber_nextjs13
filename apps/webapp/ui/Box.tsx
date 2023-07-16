"use client";
import Image from "next/image";
import Link from "next/link";
import classes from "./Box.module.scss";

export const Box = ({
  color,
  image,
  altText,
  readMore,
  link,
}: {
  color: string;
  image: string;
  altText?: string;
  readMore?: string;
  link: string;
}) => {
  return (
    <div className={classes["hover-box"]}>
      <div
        className="relative border-theme1-secondary 
        overflow-hidden border-2 rounded-lg pl-16 pt-8 pb-8 pr-16
        shadow-lg flex flex-row w-full justify-between"
      >
        <div className="relative w-60 h-60">
          <Image
            className={classes["hover-box__img"]}
            src={image}
            alt={altText ?? "Missing alt-text"}
            fill
            style={{ aspectRatio: "16/9", objectFit: "contain" }}
          />
        </div>
        <button
          className={classes["hover-box__button"]}
          style={
            {
              "--color": color,
            } as React.CSSProperties
          }
        ></button>
        <div className={classes["hover-box__content"]}>
          <h1 className="text-2xl">Tibber</h1>
          <p className="mt-4">{readMore}</p>
          <Link
            className="text-black text-2xl border-b-pink-600 border-b-2"
            href={link}
          >
            See more here
          </Link>
        </div>
      </div>
    </div>
  );
};
