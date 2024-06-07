import * as cheerio from "cheerio";

interface StandingsData {
  name: string;
  points: string;
}

export const getDriverStandings = async (): Promise<StandingsData[]> => {
  const url = "https://www.formula1.com/en/results.html/2024/drivers.html";
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const driverStandings = $(".resultsarchive-table")
    .find("tr")
    .slice(1)
    .map((i, el) => {
      const $el = $(el);
      let driver = $el.find("td").eq(2).text();
      driver = sanitizeText(driver);
      driver = driver.split(" ").slice(0, 2).join(" "); // driver has 3 text nodes (eg. max verstappen VER), we only want the first and last name
      const points = $el.find("td").eq(5).text();
      return { name: driver, points };
    })
    .get();

  return driverStandings;
};

export const getConstructorStandings = async (): Promise<StandingsData[]> => {
  const url = "https://www.formula1.com/en/results.html/2024/team.html";
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const constructorStandings = $(".resultsarchive-table")
    .find("tr")
    .slice(1)
    .map((i, el) => {
      const $el = $(el);
      let constructor = $el.find("td").eq(2).text();
      constructor = sanitizeText(constructor);
      const points = $el.find("td").eq(3).text();
      return { name: constructor, points };
    })
    .get();

  return constructorStandings;
};

const sanitizeText = (name: string) => {
  return name.replace(/\s+/g, " ").trim();
};
