import Component from "@glimmer/component";

interface DjsSearchArgs {}

export default class DjsSearch extends Component<DjsSearchArgs> {
  groupedFilters = [
    {
      groupName: "Roles",
      options: [
        { name: "dj", img: "/assets/images/badges/dj.webp" },
        { name: "vj", img: "/assets/images/badges/vj.webp" },
      ],
    },
    {
      groupName: "Badges",
      options: [
        {
          name: "strawberry",
          img: "/assets/images/badges/strawberry.webp",
        },
        { name: "orange", img: "/assets/images/badges/orange.webp" },
        { name: "lemon", img: "/assets/images/badges/lemon.webp" },
      ],
    },
    {
      groupName: "Supporter Levels",
      options: [
        "listener",
        { name: "supporter", img: "/assets/images/badges/supporter.webp" },
        {
          name: "gold_supporter",
          img: "/assets/images/badges/gold_supporter.webp",
        },
        {
          name: "emerald_supporter",
          img: "/assets/images/badges/emerald_supporter.webp",
        },
      ],
    },
  ];
}
