import Link from 'next/link';
import { FaClipboard, FaFilm, FaHome, FaHotjar, FaMoon, FaSun } from "react-icons/fa";

import { useStyleSwitcher } from "../hooks/styleSwitcher";

export default function Aside() {
  const { switchAlias, alias: styleAlias } = useStyleSwitcher();

  return (
    <header
      id="menu"
      className="flex flex-col fixed left-0 top-0 gap-4 px-4 pt-4 z-50"
    //className="flex flex-row fixed top-0 w-full items-center justify-center content-center gap-4 px-4 pt-0 z-50"
    >
      <div
        className="aside-item hover:bg-gray-200  text-gray-400 flex w-9 h-9 rounded-full cursor-pointer"
      >
        <Link href="/">
          <FaHome className="mx-auto self-center" />
        </Link>
      </div>

      <div
        className="aside-item hover:bg-gray-200  text-gray-400 flex w-9 h-9 rounded-full cursor-pointer"
      >
        <Link href="/movie">
          <FaFilm className="mx-auto self-center" />
        </Link>
      </div>

      {/*<div
        className="aside-item hover:bg-gray-200  text-gray-400 flex w-9 h-9 rounded-full cursor-pointer"
      >
        <Link href="/trend">
          <FaHotjar className="mx-auto self-center" />
        </Link>
      </div>*/}

      <div
        className="aside-item hover:bg-gray-200  text-gray-400 flex w-9 h-9 rounded-full cursor-pointer"
        onClick={() => switchAlias('')}
      >
        {styleAlias === 'dark'
          ? <FaMoon className="mx-auto self-center" />
          : <FaSun className="mx-auto self-center" />
        }
      </div>
    </header>
  );
}