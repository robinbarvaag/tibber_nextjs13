"use client";
import Image from "next/image";
import Link from "next/link";
import classes from "./box.module.scss";

export const Box = ({ color }: { color: string }) => {
  return (
    <div className={classes["hover-box"]}>
      <div
        className="relative border-theme1-secondary 
        overflow-hidden border-2 rounded-lg pl-16 pt-8 pb-8 pr-16
        shadow-lg flex flex-row w-full justify-between"
      >
        <div className="relative w-60 h-60">
          <Image
            src="/tibber_logo_blue_w1000.png"
            alt="Tibber logo"
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
          <p className="mt-4">Read more info about usage from Tibber</p>
          <Link
            className="text-black text-2xl border-b-pink-600 border-b-2"
            href="tibber/2023"
          >
            See more here
          </Link>
        </div>
      </div>
    </div>
  );
};
