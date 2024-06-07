export const pickEmoji = (label: string) => {
  label = label.toLowerCase();
  if (label.includes("fp")) {
    return "🚦";
  } else if (label.includes("qualifying")) {
    return "⏱";
  } else if (label.includes("grand prix")) {
    return "🏁";
  } else {
    return "🚦";
  }
};

export const toDiscordTime = (date: Date) => {
  // convert to epoch
  const epoch = Math.floor(date.getTime() / 1000);
  return `<t:${epoch}:f>`;
};

export const isSprintWeekend = (events: Event[]) => {
  return events.some((event) => {
    return event.type.includes("sprint");
  });
};

export const timeDifference = (start: Date, end: Date) => {
  const diff = end.getTime() - start.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days} days, ${hours} hours and ${minutes} minutes`;
};
