"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { BsSnow } from "react-icons/bs";
import { FaSkiing } from "react-icons/fa";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineVilla } from "react-icons/md";
import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import CategoryBox from "../CategoryBox";
import Container from "../Container";

export const categories = [
  {
    label: "Beach",
    icon: TbBeach,
    description: "This property is close to the beach!",
  },
  {
    label: "Modern",
    icon: MdOutlineVilla,
    description: "This property ismodern!",
  },
  {
    label: "Lux",
    icon: IoDiamond,
    description: "This property is luxurious!",
  },
  {
    label: "Pools",
    icon: TbPool,
    description: "This property has a pool!",
  },
  {
    label: "Castles",
    icon: GiCastle,
    description: "This property is in a castle!",
  },
  {
    label: "Countryside",
    icon: TbMountain,
    description: "This property is close in the countryside!",
  },
  {
    label: "Islands",
    icon: GiIsland,
    description: "This property is on an island!",
  },
  {
    label: "Lake",
    icon: GiBoatFishing,
    description: "This property is close to the lake!",
  },
  {
    label: "Skiing",
    icon: FaSkiing,
    description: "This property has skiing activities!",
  },
  {
    label: "Camping",
    icon: GiForestCamp,
    description: "This property has camping activities!",
  },
  {
    label: "Windmills",
    icon: GiWindmill,
    description: "This property is close to the windmills!",
  },
  {
    label: "Barns",
    icon: GiBarn,
    description: "This property is in a barn!",
  },
  {
    label: "Arctic",
    icon: BsSnow,
    description: "This property is in the arctic!",
  },
  {
    label: "Cave",
    icon: GiCaveEntrance,
    description: "This property is close to a cave!",
  },
  {
    label: "Desert",
    icon: GiCactus,
    description: "This property is in the desert!",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const isOnHomePage = pathname === "/";
  const category = params?.get("category");

  return (
    isOnHomePage && (
      <Container>
        <div className="pt-4 flex items-center justify-between overflow-x-auto">
          {categories.map(({ label, icon }) => (
            <CategoryBox
              key={label}
              label={label}
              icon={icon}
              selected={category === label}
            />
          ))}
        </div>
      </Container>
    )
  );
};

export default Categories;
