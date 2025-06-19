import { helper } from '@ember/component/helper';

export function formattedShrimpoRanking(params: any) {
  const rank = parseInt(params[0]);
  const totalEntries = params[1];
  let suffix;
  if(rank > 3) {
    suffix = "th";
  } else if(rank == 1) {
    suffix = "st";
  } else if(rank == 2) {
    suffix = "nd";
  } else if(rank == 3) {
    suffix = "rd";
  }
  return `${rank}${suffix} / ${totalEntries}`;
}

export default helper(formattedShrimpoRanking);
