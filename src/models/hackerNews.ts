class HackerNews {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;

  constructor(
    by: string,
    descendants: number,
    id: number,
    kids: number[],
    score: number,
    time: number,
    title: string,
    type: string,
    url: string
  ) {
    this.by = by;
    this.descendants = descendants;
    this.id = id;
    this.kids = kids;
    this.score = score;
    this.time = time;
    this.title = title;
    this.type = type;
    this.url = url;
  }
}

export { HackerNews };
