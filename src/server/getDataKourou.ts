import puppeteer, { Browser, ElementHandle } from 'puppeteer';
import mongoose from 'mongoose';
import moment from 'moment';
import moji from 'moji';

import { Case, CaseModel } from './models';

const TIME_OUT = 180000;
const SLEEP = 300000;
const URL =
  'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000121431_00086.html';

async function scrapeDaily(
  browser: Browser,
  link: { date: string; url: string }
) {
  const { date, url } = link;
  const page = await browser.newPage();
  await page.waitFor(SLEEP);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: TIME_OUT });
  await page.waitFor('tbody', { timeout: TIME_OUT });
  const tbodies = await page.$$('tbody');
  let tbody: ElementHandle;
  for (const _tbody of tbodies) {
    const firstData = await _tbody.$eval(
      'tr > td',
      (e: HTMLElement) => e.innerText
    );
    if (firstData.trim() === '国・地域') {
      tbody = _tbody;
      break;
    }
  }
  const trs = await tbody.$$('tr');
  const table = await Promise.all(
    trs.map(
      async (tr) =>
        await tr.$$eval('td', (nodes: Array<HTMLElement>) =>
          nodes.map((e: HTMLElement) => e.innerText)
        )
    )
  );
  const toNum = (str: string) => {
    return Number(
      moji(str.trim().replace(/,/g, '').replace('名', ''))
        .convert('ZE', 'HE')
        .toString()
    );
  };

  const cases = table
    .map((row) => {
      if (!['国・地域', '計'].includes(row[0])) {
        return {
          date: moment(date.replace('令和2', '2020'), 'YYYY年MM月DD日').format(
            'YYYY/MM/DD'
          ),
          country: row[0].replace('※', ''),
          cases: toNum(row[1]),
          deaths: toNum(row[2]),
        };
      }
    })
    .filter((e) => e);
  return cases;
}

async function getLinks(browser: Browser) {
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: TIME_OUT });

  await page.waitFor('div.l-contentMain > div:nth-child(5)', {
    timeout: TIME_OUT,
  });

  const div = await page.$('div.l-contentMain > div:nth-child(5)');
  const aInnerTexts = await div.$$eval('a', (nodes: Array<HTMLElement>) =>
    nodes.map((e: HTMLElement) => ({
      text: e.innerText,
      url: e.getAttribute('href'),
    }))
  );
  const links = aInnerTexts
    .map((e) => {
      const m = e.text.match(/.*新型コロナウイルス感染症.*（(令和.*?日版)/);
      if (m) {
        return {
          date: moji(m[1]).convert('ZE', 'HE').toString(),
          url: e.url,
        };
      }
    })
    .filter((e) => {
      // 3月以降に絞る。3/1は海外データがなく、
      // リンク先のタイトルが異なるのでmap()で返り値なしとなる。
      if (!e) return false;
      const m = e.date.match(/年(\d*?)月/);
      if (m && Number(m[1]) >= 3) {
        return true;
      }
    });
  return links;
}

async function save(data: Case) {
  const dbData = await CaseModel.findOne({
    date: data.date,
    country: data.country,
  });
  if (!dbData) {
    const newData = new CaseModel({
      date: data.date,
      ...data,
    });
    await newData.save();
    if (data.country === '日本') {
      console.log(data.country, 'inserted');
    }
  } else if (dbData.cases === Number(data.cases)) {
    await CaseModel.updateOne(
      { _id: dbData._id },
      {
        $set: {
          cases: data.cases,
          updatedAt: Date.now(),
        },
      }
    );
    if (data.country === '日本') {
      console.log(data.country, 'updated');
    }
  }
}

export default async function scrapeKourow() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const links = await getLinks(browser);
    for (const link of links.slice(0, 1)) {
      // 過去分は取得済みなので、直近リンク以外を除外
      //for (const link of links) {
      console.log(link);
      const cases: Array<Case> = await scrapeDaily(browser, link);
      console.log(cases[0].date);
      for (const data of cases) {
        await save(data);
      }
    }
    console.log('finished');
    return;
  } finally {
    browser.close();
  }
}
