export const getBadgeVariant = (weekNumber: number) => {
  if (weekNumber > 11 && weekNumber < 25) {
    return "bg-gradient-to-r from-green-500/85 to-green-600/85";
  } else if (weekNumber > 24 && weekNumber < 38) {
    return "bg-gradient-to-r from-yellow-400 to-yellow-500";
  } else if (weekNumber > 37 && weekNumber < 51) {
    return "bg-gradient-to-r from-orange-500/90 to-orange-600/90";
  } else {
    return "bg-gradient-to-r from-stone-300 to-stone-400";
  }
}