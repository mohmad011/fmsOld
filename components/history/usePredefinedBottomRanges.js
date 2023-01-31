import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";

const usePredefinedBottomRanges = (type = "two") => {
  return [
    {
      label: "Today",
      placement: "left",
      value: [
        new Date(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0,
            0
          )
        ),
        new Date(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            new Date().getHours(),
            new Date().getMinutes(),
            new Date().getSeconds()
          )
        ),
      ],
    },
    {
      label: "Yesterday",
      placement: "left",
      value: [
        addDays(new Date(), -1),
        new Date(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            new Date().getHours(),
            new Date().getMinutes(),
            new Date().getSeconds()
          )
        ),
      ],
    },
    // {
    //   label: "This week",
    //   placement: "left",
    //   value: [startOfWeek(new Date()), endOfWeek(new Date())],
    // },
    {
      label: "Last 7 days",
      placement: "left",
      value: [subDays(new Date(), 6), new Date()],
    },
    {
      label: "Last 30 days",
      placement: "left",
      value: [subDays(new Date(), 29), new Date()],
    },
    {
      label: "This month",
      placement: "left",
      value: [startOfMonth(new Date()), new Date()],
    },
    {
      label: "Last month",
      placement: "left",
      value: [
        startOfMonth(addMonths(new Date(), -1)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
    },
    {
      label: "This year",
      placement: "left",
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    },
    {
      label: "Last year",
      placement: "left",
      value: [
        new Date(new Date().getFullYear() - 1, 0, 1),
        new Date(new Date().getFullYear(), 0, 0),
      ],
    },
    {
      label: "All time",
      placement: "left",
      value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
    },
  ];
};

export default usePredefinedBottomRanges;
